import { createStore } from 'vuex'

import axios from 'axios'


//firebase import
import { auth, db } from '../firebase/firebaseconfig'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import {
  doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, addDoc, onSnapshot, query, where, orderBy, GeoPoint,
} from 'firebase/firestore'



const store = createStore({
  state: {
    user: null,
    profile: null,
    authIsReady: null,
    errorMessage: '',
    error: null,
    pwdResetMsg: null,
    profileInitials: null,

    delivery: null,

    postcode: null,

    estimateTime: null,

    orderId: null,

    distance: null,

    order: null,

    orders: null,

    earnings: [],

    cost: null,

    deliveryOrder: null, //an order that has been a delivery 

    riderLocation: null,

    loadingComplete: false,

    orderLocation: {
      pickupLocation: null,
      destinationLocation: null,
    },

    orderAddress: {
      pickupAddress: null,
      destinationAddress: null,
    },

    waitingRider: null,

    pickingUp: null,

    deliveryStatus: null,

    riderStatus: null,

    delivering: null,

    trackingLocation: null,

    complete: null,

    riderData: null,

  },
  getters: {
    //warning
    userType: (state) => state.profile?.userType,

    currentUserId: (state) => state.profile?.profileId,

    distance: (state) => state.distance,

    cost: (state) => state.cost,

    orders: (state) => state.orders,

    estimateTime: (state) => state.estimateTime,

    deliveryOrder: (state) => state.deliveryOrder,

    riderLocation: (state) => state.riderLocation,

  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setErrorMessage(state, payload) {
      state.errorMessage = payload
    },
    setError(state, payload) {
      state.error = payload
    },

    setAuthIsReady(state, payload) {
      state.authIsReady = payload
    },

    setPwdResetMsg(state, payload) {
      state.pwdResetMsg = payload
    },

    setProfile(state, payload) {
      if (payload) {

        state.profile = {
          profileId: payload.id,
          name: payload.data().name,
          username: payload.data().username,
          email: payload.data().email,
          userType: payload.data().userType,//warning
        }
      } else {
        state.profile = null
      }
    },

    setProfileInitials(state, payload) {
      if (payload) {
        state.profileInitials = payload.charAt(0)
      } else {
        state.profileInitials = null
      }
    },

    updateProfileName(state, payload) {
      state.profile.name = payload
    },

    updateProfileUsername(state, payload) {
      state.profile.username = payload
    },

    setOrderId(state, payload) {
      state.orderId = payload
    },

    //human readable addresses of pickup and destination
    setOrderAddress(state, payload) {

      if (payload.locationType === 'p') {
        state.orderAddress.pickupAddress = payload

      } else {
        state.orderAddress.destinationAddress = payload
      }


    },

    //orderDistance
    setDistanceInOrderDetails(state, payload) {
      state.distance = payload
    },

    setCost(state, payload) {
      state.cost = payload
    },

    //order location pickup (lat, lng) destination (lat, lng)
    setOrderLocation(state, payload) {
      state.orderLocation.pickupLocation = payload.pickupLocation
      state.orderLocation.destinationLocation = payload.destinationLocation
    },

    setEstimateTime(state, payload) {
      state.estimateTime = payload
    },

    setOrders(state, payload) {
      state.orders = payload
    },

    setPostcode(state, payload) {
      state.postcode = payload.postcode
    },

    setRiderLocation(state, payload) {
      state.riderLocation = payload
    },

    setDelivery(state, payload) {
      state.delivery = payload
    },

    setDeliveryOrder(state, payload) {
      state.deliveryOrder = payload
    },

    setPickingUp(state, payload) {
      state.pickingUp = payload
    },

    setWaitingRider(state, payload) {
      state.waitingRider = payload
    },

    setLoadingComplete(state, payload) {
      state.loadingComplete = payload
    },

    setDeliveryStatus(state, payload) {
      state.deliveryStatus = payload
    },

    setRiderStatus(state, payload) {
      state.riderStatus = payload
    },

    setRiderEarnings(state, payload) {
      state.earnings = payload
    },

    setDelivering(state, payload) {
      state.delivering = payload
    },

    setTrackingLocation(state, payload) {
      state.trackingLocation = payload
    },

    setComplete(state, payload) {
      state.complete = payload
    },

    setOrder(state, payload) {
      state.order = payload
    },

    setRiderData(state, payload) {
      state.riderData = payload
    }

  },
  actions: {

    //signup
    async signup(context, { name, username, email, password, userType }) {

      try {
        //async
        //auth
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const userData = userCred.user;
        //store in user db
        const database = doc(db, "users", userData.uid);
        const res = await setDoc(database, {
          name: name,
          username: username,
          email: email,
          userType: userType,
        })

        context.commit('setUser', res)
        context.commit('setError', false)


      } catch (error) {

        const errMessage = getCustomErrorMessage(error.message)
        context.commit('setErrorMessage', errMessage)

        context.commit('setError', true)
      }



    },

    //signin
    async signin(context, { email, password }) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password)
        context.commit('setUser', res.user)
        context.commit('setError', false)

        //const currentUuid = auth.currentUser.uid;
      } catch (error) {

        const errMessage = getCustomErrorMessage(error.message)
        context.commit('setErrorMessage', errMessage)

        context.commit('setError', true)
      }
    },

    //handling auth state changes
    handleAuthStateChanged(context, user) {
      //context.commit('setUser', user)
      context.commit('setUser', user);
      context.commit('setAuthIsReady', true)
    },

    //reset password
    async handleResetPassword(context, email) {
      try {
        await sendPasswordResetEmail(auth, email)
        context.commit('setPwdResetMsg', "If your email exists, you will receive an email")

      } catch (error) {
        const errMessage = getCustomErrorMessage(error.message)
        context.commit('setPwdResetMsg', errMessage)
      }
    },

    //get current user data//async
    async getCurrentUser(context, user) {
      try {
        if (user) {
          const currentUuid = user.uid
          const docRef = doc(db, "users", currentUuid)
          const res = await getDoc(docRef); // Use await to wait for the data to be fetched
          context.commit('setProfile', res);

          console.log("get current user", res)
        } else {
          context.commit('setProfile', null);
        }
      } catch (error) {
        console.error(error.message)
      }
    },

    //logout
    async logout(context) {
      console.log('logout action')

      //async 
      await signOut(auth)
      context.commit('setUser', null)
    },

    //update user profile data
    async updateUserSettings() {
      const docRef = doc(db, "users", store.state.profile.profileId)

      await updateDoc(docRef, {
        name: store.state.profile.name,
        username: store.state.profile.username,
      })
        .then(() => {
          store.dispatch('getCurrentUser', store.state.user)

        })
    },

    async getAddressOflocation(context, { lat, lng, locationType }) {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        const response = await axios.get(url)

        if (response) {
          const { data } = response

          const address = {
            road: data.address.road,
            suburb: data.address.suburb,
            postcode: data.address.postcode,
            locationType: locationType,
          }

          if (locationType) {
            context.commit('setOrderAddress', address)
          } else {
            context.commit('setPostcode', address)
          }
        }

      } catch (error) {
        console.error(error)
      }
    },

    //calculating distance
    getDistance(context, { pLat, pLng, dLat, dLng }) {

      const pickupLocation = {
        lat: pLat,
        lng: pLng,
      }

      const destinationLocation = {
        lat: dLat,
        lng: dLng,
      }

      context.commit('setOrderLocation', { pickupLocation: pickupLocation, destinationLocation: destinationLocation })

      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance.toFixed(1);
      }

      const calculatedDistance = calculateDistance(pLat, pLng, dLat, dLng)

      context.commit('setDistanceInOrderDetails', calculatedDistance)

    },

    //calculating cost
    calculateDeliveryCost(context, { distance, weight }) {
      const baseCost = 500;
      const distanceRate = 300;// 300ks/1km
      const weightRate = 200; // 200ks/1kg

      const distanceCost = (distance * distanceRate)
      const weightCost = (weight * weightRate)

      const cost = (baseCost + distanceCost + weightCost).toFixed(2);

      context.commit('setCost', cost)
    },

    //delete order >= 15 mins and assigned = false

    //for rider, getting orders

    async getOrders(context, postcode) {
      try {
        const colRef = collection(db, 'orders')

        const now = new Date()

        now.setMinutes(now.getMinutes() - 15)

        const q = query(colRef, where("postcode", "==", postcode), where("assigned", "==", false), where("createdAt", ">=", now), orderBy("createdAt"))
        onSnapshot(q, (snapshot) => {
          let orders = []
          snapshot.docs.forEach((doc) => {
            orders.push({ ...doc.data(), id: doc.id })
          })

          console.log("Query order: ", orders)

          context.commit('setOrders', orders)
        })
      } catch (error) {
        console.error(error.message)
      }
    },



    //get order id with customer ID related and delect doc with orderId, >= 15mins , assigned == false

    //for riders, get order by matching postcode & assigned == false & <=15 mins


    //estimate time
    async calEstimateTime(context, { pickupLocation, destinationLocation }) {
      try {
        const url = `http://router.project-osrm.org/route/v1/bicycle/${pickupLocation.lng},${pickupLocation.lat};${destinationLocation.lng},${destinationLocation.lat}?overview=false`

        const response = await axios.get(url)

        const { data } = response

        const estimateTimeSec = data.routes[0].duration;
        const estimateTimeMin = Math.ceil((estimateTimeSec / 60) * 3) //generally driving = 3x bicycle

        context.commit('setEstimateTime', estimateTimeMin)

        console.log("EstimateTime: ", estimateTimeMin)



      } catch (error) {
        console.log(error)
      }
    },

    //upload customer ordering to firebase
    async uploadOrders(context, order) {
      try {
        const ordersCollection = collection(db, "orders")
        const newOrder = {
          customerId: order.profileId,
          itemType: order.itemType,
          weight: order.weight,
          note: order.note,
          pickupLocation: order.pickupLocation,
          destinationLocation: order.destinationLocation,
          distance: order.distance,
          cost: order.cost,
          recepientName: order.recepientName,
          recepientPhone: order.recepientPhone,
          assigned: false,
          createdAt: serverTimestamp(),
          postcode: order.postcode,
          estimateTime: order.estimateTime,
          pickupAddress: order.pickupAddress,
          destinationAddress: order.destinationAddress,
        }

        const respOrder = await addDoc(ordersCollection, newOrder)


        console.log("resp Order: ", respOrder)
        context.commit('setOrderId', respOrder.id)

      } catch (error) {
        console.log(error.message)
      }
    },

    //update rider status

    async updateRiderStatus(context, { riderId, status }) {
      try {
        console.log("riderId: ", riderId)
        console.log("status: ", status)

        const docRef = doc(db, "ridersDetails", riderId)

        let respData = null

        //get current rider details
        const unsub = onSnapshot(docRef, (docSnap) => {
          respData = docSnap.data()
          if (respData) {
            console.log('resp data rider update status: ', respData)
            setDoc(docRef, {
              location: respData.location,
              postcode: respData.postcode,
              status: status,
            }).then(() => {
              console.log("rider status updated to ", status)
              context.commit('setRiderStatus', status)
            })
          }

          unsub()
        })

      } catch (error) {
        console.error("error while updaing rider status: ", error)
      }
    },

    //upload rider location

    async updateRiderLocation(context, { lat, lng, riderId, postcode }) {

      try {
        const docRef = doc(db, "ridersDetails", riderId)
        await setDoc(docRef, {
          //location
          location: new GeoPoint(lat, lng),
          //postcode
          postcode: postcode,

        }).then(() => {
          console.log("updated rider location")
        })

        const riderLocation = {
          lat: lat,
          lng: lng,
        }

        context.commit('setRiderLocation', riderLocation)

      } catch (error) {
        console.log(error.message)
      }

    },

    async uploadDelivery(context, orderId) {
      try {

        let respOrder = null

        const orderRef = doc(db, "orders", orderId)
        onSnapshot(orderRef, (docResp) => {
          respOrder = docResp.data()

          if (respOrder.assigned === false) {

            updateDoc(orderRef, {
              assigned: true,
            }).then(() => {
              console.log("Order docement updated to assigned: true")
            })
              .catch((error) => {
                console.error("error updaing order document: ,", error)
              })

            //


            const deliveryData = {
              orderId: orderId,
              riderId: auth.currentUser.uid,
              customerId: respOrder.customerId,
              status: "picking up"
            }

            const deliveryRef = doc(db, "deliveries", orderId)
            setDoc(deliveryRef, deliveryData)
              .then(() => {
                console.log("Delivery document created successfully")
              })
              .catch((error) => {
                console.error("Error creating delivery document: ", error)
              })

            context.commit('setDeliveryStatus', "picking up")

          }

          //

          context.commit('setDeliveryOrder', respOrder)
          context.commit('setLoadingComplete', true)
          console.log('Resp Order: ', respOrder)
        })
        //unsubOrder()

      } catch (error) {
        console.log(error)
      }
    },



    //get delivery for customer also rider location
    async getDelivery(context, orderId) {
      try {

        let location1 = null
        let location2 = null
        let destinationLocation = null

        const orderRef = doc(db, "orders", orderId)

        const orderResp = await getDoc(orderRef)

        if (orderResp.exists) {
          const orderData = orderResp.data()
          console.log("orderData", orderData)
          location2 = orderData.pickupLocation
          destinationLocation = orderData.destinationLocation

          context.commit('setOrder', orderData)
          console.log("location2: ", location2)
        }

        let delidata = null
        const colRef = collection(db, "deliveries")

        const q = query(colRef, where("orderId", "==", orderId))

        const unsubDeli = onSnapshot(q, async (deliSnap) => {

          if (!deliSnap.empty) {

            context.commit('setWaitingRider', false)

            deliSnap.forEach((doc) => {
              delidata = doc.data()
              context.commit('setDeliveryStatus', delidata.status)
              console.log("Deli snap: ", delidata)
            })

            const docRef = doc(db, "users", delidata.riderId)

            const riderResp = await getDoc(docRef)
            const respriderData = riderResp.data()

            const riderData = {
              name: respriderData.name,
              email: respriderData.email,
            }

            context.commit('setRiderData', riderData)

            //you can track delivery
            if (delidata.status === "picking up") {
              //rider is coming to pick up package
              //pickingup to true
              context.commit('setWaitingRider', false)
              context.commit('setComplete', false)
              context.commit('setDelivering', false)
              context.commit('setPickingUp', true)

              console.log("rider id: ", delidata.riderId)
              const riderDetailsRef = doc(db, "ridersDetails", delidata.riderId)

              onSnapshot(riderDetailsRef, (riderDetailsSnap) => {
                if (riderDetailsSnap.exists) {
                  const riderDetailsData = riderDetailsSnap.data()
                  console.log("rider details snap: ", riderDetailsData)
                  console.log("lat: ", riderDetailsData.location._lat, "\nlng: ", riderDetailsData.location._long)

                  location1 = {
                    lat: riderDetailsData.location._lat,
                    lng: riderDetailsData.location._long,
                  }

                  console.log("locations: ", location1, location2)


                  if (location2) {
                    context.dispatch('calEstimateTime', { pickupLocation: location1, destinationLocation: location2 })
                  }

                } else {
                  console.log("Empty rider details: ", riderDetailsSnap)
                }

              })

            } else if (delidata.status === "delivering") {
              //pickingup to false = delivering
              //so can track on map

              context.commit('setComplete', false)
              context.commit('setPickingUp', false)
              context.commit('setWaitingRider', false)

              //onSnapshot riderDetails with riderId and get location

              const riderDetailsRef = doc(db, "ridersDetails", delidata.riderId)

              onSnapshot(riderDetailsRef, (riderDetailsSnap) => {
                if (riderDetailsSnap.exists) {
                  const riderDetailsData = riderDetailsSnap.data()

                  location1 = {
                    lat: riderDetailsData.location._lat,
                    lng: riderDetailsData.location._long,
                  }

                  const trackingLocation = {
                    riderLocation: location1,
                    destinationLocation: destinationLocation,
                  }
                  console.log("delivering locations: ", trackingLocation)

                  context.commit('setTrackingLocation', trackingLocation)

                } else {
                  console.log("Empty rider details: ", riderDetailsSnap)
                }

                context.commit('setDelivering', true)

              })
              context.commit('setDelivering', true)

            } else if (delidata.status === "complete") {

              unsubDeli()
              context.commit('setDelivering', false)
              context.commit('setWaitingRider', false)
              context.commit('setPickingUp', false)
              context.commit('setComplete', true)
            }


          } else {
            //waiting rider to accept the order
            context.commit('setDelivering', false)
            context.commit('setWaitingRider', true)
            context.commit('setPickingUp', false)
            context.commit('setComplete', false)
          }
        })

      } catch (error) {
        console.error("Error getting delivery doc snapshot: ", error)
      }
    },



    //getDelivery status

    async getDeliveryStatus(context, orderId) {
      try {
        const docRef = doc(db, "deliveries", orderId)

        onSnapshot(docRef, (docSnap) => {
          const respDeli = docSnap.data()

          context.commit('setDeliveryStatus', respDeli.status)
        })
      } catch (error) {
        console.error("Error while getting delivery status")
      }
    },


    //update delivery status
    async updateDeliveryStatus(context, { status, orderId }) {
      try {
        const docRef = doc(db, "deliveries", orderId)
        updateDoc(docRef, {
          status: status
        }).then(() => {
          console.log("delivery status is changed to ", status)
          let respDeli = null
          onSnapshot(docRef, (docSnap) => {
            respDeli = docSnap.data()
            console.log("DeliveryStatus: ", respDeli.status)
            context.commit('setDeliveryStatus', respDeli.status)
          })

        })
      } catch (error) {
        console.error("error updating delivery status: ", error)
      }
    },

    //update rider earning
    async updateRiderEarning(context, { riderId, orderId, distance, destinationAddress, cost }) {
      try {
        const earning = (cost * 0.9).toFixed(0)
        const colRef = collection(db, "ridersEarning")
        const resp = await addDoc(colRef, {
          riderId: riderId,
          orderId: orderId,
          distance: distance,
          destinationAddress: destinationAddress,
          earning: earning,
        })

        context.commit('setRiderEarnings', resp)
      } catch (error) {
        console.error("error while updating rider earning: ", error)
      }
    },

    //get rider earning


    getRiderEarning(context, riderId) {
      try {
        const colRef = collection(db, "ridersEarning")
        const q = query(colRef, where("riderId", "==", riderId))

        onSnapshot(q, (docSnap) => {
          if (docSnap.empty) {
            context.commit('setRiderEarnings', [])
          } else {
            let earnings = []
            docSnap.forEach((doc) => {
              earnings.push(doc.data())

            })

            context.commit('setRiderEarnings', earnings)
            console.log("earnings: ", earnings)
          }
        })
      } catch (error) {
        console.error("error while getting rider earning: ", error)
      }
    }

  },
  modules: {
  }
})

//error message filter
function getCustomErrorMessage(errorCode) {
  switch (errorCode) {
    case 'Firebase: Error (auth/invalid-email).':
      return 'Invalid email address. Please enter a valid email.';
    case 'Firebase: Error (auth/user-disabled).':
      return 'User account has been disabled.';
    case 'Firebase: Error (auth/user-not-found).':
      return 'User not found. Please check your email and try again.';
    case 'Firebase: Error (auth/wrong-password).':
      return 'Incorrect password. Please try again.';
    case 'Firebase: Error (auth/email-already-in-use).':
      return 'Email is already in use. Please choose a different email.';
    case 'Firebase: Error (auth/weak-password).':
      return 'Password is too weak. Please choose a stronger password.';
    default:
      return 'An error occurred. Please try again later.';
  }
}


//on auth state changed
onAuthStateChanged(auth, (user) => {

  //user is already login

  store.dispatch('getCurrentUser', user)

  store.dispatch('handleAuthStateChanged', user)

  console.log("on auth state change", user)

})

export default store