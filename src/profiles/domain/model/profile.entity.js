/**
 * Profile entity.
 * Represents user profile data and provides computed helpers.
 */
export class Profile {
  // Properties
  /**
   * Creates a new Profile entity.
   * @param {Object} [options] - Profile fields.
   * @param {number} [options.id=0] - Profile id.
   * @param {number} [options.userId=0] - Related user id.
   * @param {string} [options.name=''] - Full name.
   * @param {string} [options.email=''] - Primary email.
   * @param {string} [options.username=''] - Username.
   * @param {string} [options.address=''] - Address.
   * @param {number} [options.age=0] - Age.
   * @param {string} [options.phoneNumber=''] - Phone number.
   * @param {string} [options.secondEmail=''] - Secondary email.
   * @param {string} [options.photoUrl=''] - Photo URL.
   * @param {string} [options.role=''] - User role.
   */
  constructor({
    id = 0,
    userId = 0,
    name = '',
    email = '',
    username = '',
    address = '',
    age = 0,
    phoneNumber = '',
    secondEmail = '',
    photoUrl = '',
    role = ''
  } = {}) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.username = username;
    this.address = address;
    this.age = age;
    this.phoneNumber = phoneNumber;
    this.secondEmail = secondEmail;
    this.photoUrl = photoUrl;
    this.role = role;
  }

  // Accessors
  /**
   * Returns the display URL for the profile photo, or a placeholder if none is set.
   * @returns {string} URL of the photo to display.
   */
  get displayPhotoUrl() {
    return this.photoUrl && this.photoUrl.trim() !== ''
      ? this.photoUrl
      : 'https://via.placeholder.com/40x40/10B981/FFFFFF?text=U';
  }
}
