import { Profile } from '../domain/model/profile.entity.js';

export class ProfileAssembler {
  static toDomainFromResponse(response) {
    if (!response) {
      return { profileEntity: new Profile({}), configData: {} };
    }

    const profileData = {
      id: response.id,
      // Backend returns 'name' in the profile response
      name: response.name || response.fullName || '',
      email: response.email || '',
      username: response.username || '',
      role: response.role || '',

      photoUrl: response.photoUrl && response.photoUrl !== 'undefined'
        ? response.photoUrl
        : undefined,

      phoneNumber: response.phoneNumber || '',
      address: response.address || ''
    };

    return {
      profileEntity: new Profile(profileData),
      configData: {}
    };
  }
}
