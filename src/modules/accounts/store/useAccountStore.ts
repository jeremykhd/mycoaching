import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAccountService } from '../services/useAccountService'
import type { Account } from '../models/Account'
import { POSITION, useToast } from 'vue-toastification'
import type { Health } from '../models/Health'
import type { Objectives } from '../models/Objectives'
import { useHealthService } from '../services/useHealthService'
import { useObjectivesService } from '../services/useObjectivesService'

export const useAccountStore = defineStore('account', () => {
    // Initialisation de toast notification pour les messages
    const toast = useToast()

    // Initialisation des states du store
    const account = ref<Account | null>(null)
    const accounts = ref<Account[]>([])
    const loading = ref(false)

    // Récupération des méthodes du service.
    const { getAccount, getAccounts, postAccount, patchAccount } = useAccountService()
    const { postHealth, patchHealth } = useHealthService()
    const { postObjectives, patchObjectives } = useObjectivesService()

    // Récupération des methodes du service en lien pour les getters et actions.

    const fetchAccount = async (userId: string) => {
        // Notifier le store qu'un chargement est en cours.
        loading.value = true
        try {
            // Récupération du compte de l'utilisateur avec la méthode du service en lien.
            const { data, error } = await getAccount(userId)

            if (error) throw new Error(error.message)

            // Mis à jour des states du store.
            account.value = data as Account

            // Affichage du message de succès.
            // toast.success(`Le compte de l'utilisateur a bien été récupéré`, {
            //   position: POSITION.BOTTOM_RIGHT
            // })
            return data
        } catch (error) {
            console.error('Error fetching accounts:', error)

            // Affichage du message d'erreur.
            toast.error(error, { position: POSITION.BOTTOM_RIGHT })
        } finally {
            // Notifier le store que le chargement est fini.
            loading.value = false
        }
    }

    const fetchAccounts = async () => {
        // Notifier le store qu'un chargement est en cours.
        loading.value = true
        try {
            // Récupération de tous les comptes.
            const { data, error } = await getAccounts()

            if (error) throw new Error(error.message)

            // Mis à jour des states du store.
            accounts.value = data || []

            // Affichage du message de succès.
            toast.success('Liste des comptes bien récupérés', {
                position: POSITION.BOTTOM_RIGHT
            })
        } catch (error) {
            console.error('Error fetching accounts:', error)

            // Affichage du message d'erreur.
            toast.error(`Erreur : ${error}`, {
                position: POSITION.BOTTOM_RIGHT
            })
        } finally {
            // Notifier le store que le chargement est fini.
            loading.value = false
        }
    }

    const createAccount = async (accountData: Partial<Account>, email: string, userId: string) => {
        // Notifier le store qu'un chargement est en cours.
        loading.value = true
        try {
            console.log('... avant la promesse')
            // Utilisation de la méthode post du service en lien pour créer un compte lors de la première connexion.
            const { data, error } = await postAccount(accountData, email, userId)
            console.log('... apres la promesse')

            console.log(data)
            if (error) throw new Error(error.message)

            // Mis à jour des states du store.
            account.value = data

            // Affichage du message de succès.
            toast.success('Les informations de votre compte on bien été pris en compte', {
                position: POSITION.BOTTOM_RIGHT
            })
        } catch (error) {
            console.error('Error fetching accounts:', error)

            // Affichage du message d'erreur.
            toast.error(`Erreur : ${error}`, {
                position: POSITION.BOTTOM_RIGHT
            })
        } finally {
            // Notifier le store que le chargement est fini.
            loading.value = false
        }
    }

    const updateAccount = async (accountId: number, accountData: Partial<Account>) => {
        // Notifier le store qu'un chargement est en cours.
        loading.value = true

        try {
            // Utilisation de la méthode patch du service en lien, pour mettre à jour le compte d'un utlisateur.
            const { data, error } = await patchAccount(accountId, accountData)

            // Si la liste des comptes n'est pas vide/null, retirer et ajouter le compte à jour.
            if (accounts.value) {
                const index = accounts.value?.findIndex((a) => a.id === accountId)
                if (index !== -1) {
                    accounts.value[index] = data as Account
                }
            }

            if (error) throw new Error(error.message)

            // Affichage du message de succès.
            toast.success('Le compte a bien été mis à jour.', {
                position: POSITION.BOTTOM_RIGHT
            })

            return data
        } catch (error) {
            console.error('Error fetching accounts:', error)

            // Affichage du message d'erreur.
            toast.error(`Erreur : ${error}`, {
                position: POSITION.BOTTOM_RIGHT
            })
        } finally {
            // Notifier le store que le chargement est fini.
            loading.value = false
        }
    }

    const createHealth = async (healthData: Partial<Health>) => {
        // Notifier le store qu'un chargement est en cours.
        loading.value = true
        try {
            if (account.value) {
                // Utilisation de la méthode post du service en lien pour créer un compte lors de la première connexion.
                const health = await postHealth(healthData)

                if (health.error) throw new Error(health.error.message)

                const { data, error } = await patchAccount(account.value?.id, {
                    health: health.data as Health
                })

                if (error) throw new Error(error.message)

                // Mis à jour des states du store.
                account.value = data

                // Affichage du message de succès.
                toast.success('Les informations de votre compte on bien été pris en compte', {
                    position: POSITION.BOTTOM_RIGHT
                })

                return data
            } else {
                throw new Error(`'Aucun compte n'est disponible`)
            }
        } catch (error) {
            console.error('Error fetching accounts:', error)

            // Affichage du message d'erreur.
            toast.error(`Erreur : ${error}`, {
                position: POSITION.BOTTOM_RIGHT
            })
        } finally {
            // Notifier le store que le chargement est fini.
            loading.value = false
        }
    }
    const updateHealth = async (healthId: number, healthData: Partial<Omit<Health, 'id'>>) => {
        loading.value = true
        try {
            // Mise à jour des données de santé directement dans la table health
            const { data, error } = await patchHealth(healthId, healthData)

            if (error) throw new Error(error.message)

            toast.success('Les informations de santé ont été mises à jour.', {
                position: POSITION.BOTTOM_RIGHT
            })

            // Refetch de l'account pour avoir les données à jour
            if (account.value?.user_id) {
                console.log("... refetch du compte après l'update")
                const updatedAccount = await fetchAccount(account.value.user_id)
                return updatedAccount
            }
        } catch (error) {
            console.error('Error updating health:', error)
            toast.error(`Erreur : ${error}`, {
                position: POSITION.BOTTOM_RIGHT
            })
        } finally {
            loading.value = false
        }
    }

    const updateObjectives = async (accountId: number, objectivesData: Partial<Objectives>) => {
        loading.value = true
        try {
            // Mise à jour des objectifs
            const { data, error } = await patchAccount(accountId, {
                training_objectives: objectivesData
            } as Partial<Account>)

            if (error) throw new Error(error.message)

            // Refetch de l'account pour avoir les données à jour
            if (account.value?.user_id) {
                await fetchAccount(account.value.user_id)
            }

            toast.success('Les objectifs ont été mis à jour.', {
                position: POSITION.BOTTOM_RIGHT
            })

            return data
        } catch (error) {
            console.error('Error updating objectives:', error)
            toast.error(`Erreur : ${error}`, {
                position: POSITION.BOTTOM_RIGHT
            })
        } finally {
            loading.value = false
        }
    }

    return {
        account,
        accounts,
        loading,
        fetchAccount,
        fetchAccounts,
        createAccount,
        createHealth,
        updateAccount,
        updateHealth,
        updateObjectives
    }
})
