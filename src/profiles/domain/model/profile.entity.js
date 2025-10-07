export class Profile {
  constructor({
    id = null,
    name = '',
    email = '',
    role = 'builder',
    photoUrl = 'https://i.postimg.cc/52gRVfdL/default-avatar.png',
    phoneNumber = '',
    address = ''
  } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;

    this.photoUrl = photoUrl && photoUrl !== 'undefined'
      ? photoUrl
      : 'https://i.postimg.cc/52gRVfdL/default-avatar.png';

    this.phoneNumber = phoneNumber;
    this.address = address;
  }
}
