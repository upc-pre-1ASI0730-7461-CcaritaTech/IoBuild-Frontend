import { defineStore } from "pinia";
import { ref } from "vue";
import { ProfileAssembler } from "../infrastructure/profile.assembler.js";
import { ProfileApi } from "../infrastructure/profile-api.js";
import { Profile } from "../domain/model/profile.entity.js";

const profileApi = new ProfileApi();

/**
 * Pinia store for profile functionality.
 * Manages profile state and CRUD operations for profiles.
 */
export const useProfileStore = defineStore('profile', () => {
    // State
    const profile = ref(new Profile({}));
    const viewType = ref('');
    const isLoading = ref(false);
    const profileLoaded = ref(false);
    const errors = ref([]);

    // Actions
    /**
     * Fetches a profile by user ID from the API.
     * @param {string|number} userId - The ID of the user to fetch.
     * @returns {Promise<void>} Resolves when the profile is fetched or an error occurs.
     */
    async function fetchProfile(userId) {
        isLoading.value = true;
        errors.value = [];

        try {
            const response = await profileApi.getProfile(userId);
            const { profileEntity } = ProfileAssembler.toDomainFromResponse(response);

            profile.value = profileEntity;
            viewType.value = profileEntity.role || 'builder';
            profileLoaded.value = true;

        } catch (error) {
            console.error('', error);
            errors.value.push(error.message || '');
            profileLoaded.value = false;

        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Creates a new profile in the backend.
     * @param {Object} profileData - Data used to create the profile.
     * @returns {Promise<any>} A promise that resolves with the API response.
     */
    async function createProfile(profileData) {
        isLoading.value = true;
        errors.value = [];

        try {
            const response = await profileApi.createProfile(profileData);
            return response;
        } catch (error) {
            console.error('Error creating profile:', error);
            errors.value.push(error.message || 'Error creating profile');
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Updates an existing profile by ID.
     * @param {string|number} profileId - The ID of the profile to update.
     * @param {Object} profileData - Data to update the profile with.
     * @returns {Promise<any>} A promise that resolves with the API response.
     */
    async function updateProfile(profileId, profileData) {
        isLoading.value = true;
        errors.value = [];

        try {
            const response = await profileApi.updateProfile(profileId, profileData);
            return response;
        } catch (error) {
            console.error('Error updating profile:', error);
            errors.value.push(error.message || 'Error updating profile');
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Sets the second email for the currently logged-in user (reads userId from localStorage).
     * @param {string} secondEmail - The secondary email to set.
     * @returns {Promise<any>} A promise that resolves with the API response.
     */
    async function setSecondEmail(secondEmail) {
        isLoading.value = true;
        errors.value = [];

        try {
            const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
            const response = await profileApi.setSecondEmailByUserId(userId, secondEmail);
            return response;
        } catch (error) {
            console.error('Error setting second email:', error);
            errors.value.push(error.message || 'Error setting second email');
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        profile,
        viewType,
        isLoading,
        profileLoaded,
        errors,
        fetchProfile,
        createProfile,
        updateProfile,
        setSecondEmail
    };
});