<template>
    <div class="profile">
        <!-- //modal comp -->

        <ModalCompVue v-if="modalActive" :modalMessage="modalMessage" @close-modal="closeModal" />

        <div class="container">
            <h2>Account Settings</h2>
            <div v-if="profileInitials" class="profile-info">
                <div class="initials">{{ profileInitials }}</div>

                <!-- need to check user type  -->
                <div v-if="userType === 'admin'" class="user-badge">
                    <i class="material-icons icon">security</i>
                    <span>admin</span>
                </div>

                <div v-if="userType === 'customer'" class="user-badge">
                    <i class="material-icons icon">account_box</i>
                    <span>user</span>
                </div>

                <div v-if="userType === 'rider'" class="user-badge">
                    <i class="material-icons icon">account_box</i>
                    <span>rider</span>
                </div>


                <div class="input">
                    <label for="name">Name:</label>
                    <input type="text" id="name" v-model="profileName">
                </div>

                <div class="input">
                    <label for="username">Username:</label>
                    <input type="text" id="username" v-model="profileUsername">
                </div>

                <div class="input">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="profileEmail" disabled>
                </div>

                <button @click="updateProfile">Save Changes</button>

            </div>
        </div>
    </div>
</template>

<script>

import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import ModalCompVue from '@/components/ModalComp.vue'
export default {

    components: {
        ModalCompVue,
    },

    setup() {
        const store = useStore()

        const profileInitials = computed(() => store.state.profileInitials)

        const userType = computed(() => store.state.profile.userType)

        const profileName = computed({
            get:() => store.state.profile.name,
            set:(newValue) => {
                store.commit("updateProfileName", newValue)
            }
        })

        const profileUsername = computed({
            get:() => store.state.profile.username,
            set:(newValue) => {
                store.commit("updateProfileUsername", newValue)
            }
        })

        const profileEmail = computed(() => store.state.profile.email)

        const updateProfile = () => {
            store.dispatch("updateUserSettings")
            modalActive.value = true
        }

        const modalMessage = ref('Changes were saved!')
        const modalActive = ref(null)

        const closeModal = () => {
            modalActive.value = !modalActive.value
        }

        return {
            profileName,
            profileUsername,
            profileEmail,
            profileInitials,
            modalMessage,
            modalActive,
            closeModal,
            updateProfile,
            userType,
        }
    }

}
</script>

<style lang="scss" scoped>
.profile {
    .container {
        max-width: 1000px;
        padding: 60px 25px;

        h2 {
            text-align: center;
            margin-bottom: 16px;
            font-weight: 300;
            font-size: 32px;
        }

        .profile-info {
            border-radius: 8px;
            box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 32px;
            background-color: #f1f1f1;
            display: flex;
            flex-direction: column;
            max-width: 600px;
            margin: 32px auto;

            .initials {
                position: initial;
                width: 80px;
                height: 80px;
                font-size: 32px;
                background-color: #303030;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                align-self: center;
                border-radius: 50%;
            }

            .user-badge {
                display: flex;
                align-self: center;
                color: white;
                font-size: 14px;
                padding: 8px 24px;
                border-radius: 8px;
                background-color: #303030;
                margin: 16px 0;
                text-align: center;
                text-transform: capitalize;

                .icon {
                    margin-right: 8px;
                }

            }

            .input {
                margin: 16px 0;

                label {
                    font-size: 14px;
                    display: block;
                    padding-bottom: 6px;
                }

                input {
                    width: 100%;
                    border: none;
                    background-color: #f2f7f6;
                    padding: 8px;
                    height: 50px;

                    @media (min-width: 900px) {}

                    &:focus {
                        outline: none;
                    }
                }
            }

            button {
                align-self: center;
                height: auto;
            }

        }
    }
}
</style>