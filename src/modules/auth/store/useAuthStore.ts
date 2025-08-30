import type { Account } from '@/modules/accounts/models/Account'
import { useAccountService } from '@/modules/accounts/services/useAccountService'
import { supabase } from '@/shared/services/supabaseClient'
import type { Session, User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { POSITION, useToast } from 'vue-toastification'

export const useAuthStore = defineStore('auth', () => {
    // Initialisation de toast notification pour les messages
    const toast = useToast()

    // Initialisation des states du store
    const user = ref<User | null>(null)
    const account = ref<Account | null>(null)
    const actualSession = ref<Session | null>(null)
    const loading = ref(false)
    const loadingSession = ref(false)
    const error = ref<string | null>(null)
    const pendingVerification = ref<boolean>(false)
    const pendingVerificationEmail = ref<string>('')

    // Récupération des methodes du service en lien pour les getters et actions
    const { getAccount } = useAccountService()

    // Verfie si l'utilisateur est un admin
    const isAdmin = () => {
        return account.value?.role?.name === 'ROLE_ADMIN' ?? false
    }

    // Récupération de l'utilisateur connecté et de sa session.
    const fetchUser = async () => {
        console.log('Fetching user...')
        // Notifier le state qu'un chargement est en cours.
        loadingSession.value = true
        if (loadingSession.value && user.value === null && account.value === null) {
            try {
                // Récupération de la session de l'utilisateur et de ses informations.
                const {
                    data: { session },
                    error
                } = await supabase.auth.getSession()

                if (error) throw new Error(error.message)
                // Mis à jour des states du store
                actualSession.value = session
                user.value = session?.user ?? null

                console.log(user.value)
                if (user.value) {
                    console.log('...chargement du compte')
                    // Récupération du compte de l'utilisateur.
                    const { data } = await getAccount(user.value.id)
                    // Mis à jour des states du store
                    account.value = data
                }
            } catch (e) {
                console.error('Error fetching user:', e)
                error.value =
                    e instanceof Error
                        ? e.message
                        : "Une erreur est survenue lors de la récupération de l'utilisateur connecté"

                // Affichage du message d'erreur
                toast.error(`Erreur : ${error.value}`, {
                    position: POSITION.BOTTOM_RIGHT
                })
            } finally {
                loadingSession.value = false
            }
        } else {
            loadingSession.value = false
        }
    }

    // Méthode pour se connecter en utilisant un mot de passe, à mettre en place dans le futur.
    const signIn = async (email: string, password: string) => {
        try {
            // Notifier le store qu'un chargement est en cours.
            loading.value = true
            error.value = null

            // Utilisation de la méthode supabase signInWithPassword pour connecter l'utilisateur avec un mdp.
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (signInError) throw signInError

            // Mis à jour des states du store.
            actualSession.value = data.session
            user.value = data.user

            // Affichage du message toast
            toast.info(`Bienvenue sur l'application.`, {
                position: POSITION.BOTTOM_RIGHT
            })
            return data
        } catch (e: any) {
            error.value = e.message || 'Une erreur est survenue lors de la connexion'
            // Affichage du message d'erreur
            toast.error(`Erreur : ${error.value}`, {
                position: POSITION.BOTTOM_RIGHT
            })
        } finally {
            // Notifier le store que le chargement est fini.
            loading.value = false
        }
    }

    const signOut = async () => {
        // Utilisation de la méthode signOut de supabse pour mettre fin
        // à la session de l'utilisateur et le déconnecter
        await supabase.auth.signOut()

        // Remise à défaut des states du store
        actualSession.value = null
        user.value = null
        account.value = null
        pendingVerification.value = false
        pendingVerificationEmail.value = ''

        // Affichage du message toast
        toast.info(`Vous avez bien été deconnecté de votre session.`, {
            position: POSITION.BOTTOM_RIGHT
        })
    }

    const sendOTP = async (email: string) => {
        try {
            // Notifier le store qu'un chargement est en cours.
            // loading.value = true
            error.value = null

            // Utilisation de la méthode supabase signInWithOtp pour envoyer le code de vérification afin de se connecter.
            const { error: signInError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false
                }
            })
            if (signInError) throw signInError

            // Mis à jour des states du store pour la verification du code.
            pendingVerification.value = true
            pendingVerificationEmail.value = email

            // Affichage du message toast.
            toast.info(`Un email avec le code de vérification vous à été envoyé.`, {
                position: POSITION.BOTTOM_RIGHT
            })
        } catch (e: any) {
            error.value = e.message || "Erreur lors de l'envoi du code OTP"
            // Affichage du message d'erreur toast.
            toast.error(`Erreur : ${error.value}`, {
                position: POSITION.BOTTOM_RIGHT
            })
        } finally {
            // Notifier le store que le chargement est fini.
            loading.value = false
        }
    }

    const verifyOTP = async (token: string) => {
        // Si il n'y a pas de vérifcation en cours, renvoie une erreur
        if (!pendingVerification.value) {
            throw new Error('Aucune vérification en attente')
        }

        try {
            // Notifier le store qu'un chargement est en cours.
            loadingSession.value = true
            error.value = null
            // Utilisation de le méthode supabase verifyOtp pour vérifier le code, renvoi l'utilisateur.
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email: pendingVerificationEmail.value,
                token,
                type: 'email'
            })

            if (verifyError) throw verifyError

            // Mis à jour des states du store.
            user.value = data.user
            actualSession.value = data.session

            if (user.value) {
                // Récupération du compte de l'utilisateur.
                const { data } = await getAccount(user.value.id)
                // Mis à jour des states du store
                account.value = data
            }

            pendingVerification.value = false
            pendingVerificationEmail.value = ''

            // Affichage du message toast
            toast.success(`Code vérifié avec succes, bienvenue sur l'application.`, {
                position: POSITION.BOTTOM_RIGHT
            })
            // Notifier le store que le chargement est fini.
            loadingSession.value = false
        } catch (e: any) {
            error.value = e.message || 'Erreur lors de la vérification du code OTP'
            // Affichage du message d'erreur toast.
            toast.error(`Erreur : ${error.value}`, {
                position: POSITION.BOTTOM_RIGHT
            })
        }
    }

    const clearPendingVerification = () => {
        pendingVerification.value = false
        pendingVerificationEmail.value = ''
    }

    return {
        user,
        account,
        actualSession,
        loading,
        loadingSession,
        error,
        pendingVerification,
        pendingVerificationEmail,
        isAdmin,
        fetchUser,
        signIn,
        signOut,
        sendOTP,
        verifyOTP,
        clearPendingVerification
    }
})
