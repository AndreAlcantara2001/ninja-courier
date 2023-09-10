<template>
    <div class="reset-password">
        <ForgotPwdModal v-if="modalActive" :modalMessage="modalMessage" @close-modal="closeModal" />
        <LoadingVue v-if="loading" />
        <div class="form-wrap">
            <form class="reset" @submit.prevent="resetPwd">
                <p class="login-register">
                    Back to
                    <router-link class="router-link" :to="{ name: 'loginView' }">Login</router-link>
                </p>
                <h2>Reset Password</h2>
                <p>Forgot your password? Enter your email to reset it</p>

                <div class="inputs">
                    <div class="input">
                        <input type="email" placeholder="Email" v-model="email" required>
                        <i class="material-icons icon">email</i>
                    </div>
                </div>
                <button type="submit">Reset</button>
                <div class="angle"></div>
            </form>
            <div class="background"></div>
        </div>
    </div>
</template>

<script>
import ForgotPwdModal from '@/components/ModalComp.vue'
import { computed, ref } from 'vue'
import LoadingVue from '@/components/LoadingVue.vue'
import { useStore } from 'vuex'
export default {

    components: {
        ForgotPwdModal,
        LoadingVue,
    },

    setup() {

        const store = useStore()

        const email = ref('')

        const modalMessage = computed(() => store.state.pwdResetMsg)
        const modalActive = ref(null)
        const loading = ref(null)



        const closeModal = () => {
            modalActive.value = !modalActive.value
            email.value = ""
        }

        const resetPwd = async () => {
            loading.value = true
            await store.dispatch('handleResetPassword', email.value)
            if (modalMessage.value) {
                console.log(modalMessage.value)
                modalActive.value = true
                loading.value = false
            }

            return
        }

        return {
            email, modalActive, modalMessage, closeModal, loading, resetPwd
        }
    }
}
</script>

<style lang="scss" scoped>
.reset-password {
    position: relative;

    .form-wrap {
        .reset {
            h2 {
                margin-bottom: 8px;
            }

            p {
                margin-bottom: 32px;
            }

            button {
                margin-top: 30px;
            }
        }
    }
}
</style>