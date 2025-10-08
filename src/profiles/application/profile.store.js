import { defineStore } from "pinia";
import { ref } from "vue";
import { ProfileAssembler } from "../infrastructure/profile.assembler.js";
import { ProfileApi } from "../infrastructure/profile-api.js";
import { Profile } from "../domain/model/profile.entity.js";

const profileApi = new ProfileApi();

export const useProfileStore = defineStore('profile', () => {
    const profile = ref(new Profile({}));
    const viewType = ref('');
    const isLoading = ref(false);
    const profileLoaded = ref(false);
    const errors = ref([]);

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

    return {
        profile,
        viewType,
        isLoading,
        profileLoaded,
        errors,
        fetchProfile
    };
});