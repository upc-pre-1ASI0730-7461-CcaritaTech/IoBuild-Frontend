export class Profile {
  constructor({
    id = 0,
    name = '',
    username = '',
    address = '',
    age = 0,
    phoneNumber = '',
    photoUrl = 'https://via.placeholder.com/40x40/10B981/FFFFFF?text=U',
    role = 'builder'
  } = {}) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.address = address;
    this.age = age;
    this.phoneNumber = phoneNumber;
    this.photoUrl = photoUrl;
    this.role = role;
  }

  get displayPhotoUrl() {
    return this.photoUrl && this.photoUrl.trim() !== ''
      ? this.photoUrl
      : 'https://via.placeholder.com/40x40/10B981/FFFFFF?text=U';
  }
}
