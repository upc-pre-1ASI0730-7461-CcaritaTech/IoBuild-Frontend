export class ProfileApi {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  async getProfile(userId) {
    if (!userId) throw new Error('User ID is required for fetching profile.');

    const userResponse = await fetch(`${this.baseUrl}/users/${userId}`);
    const user = await userResponse.json();

    const detailResponse = await fetch(`${this.baseUrl}/user_details?userId=${userId}`);
    const details = await detailResponse.json();
    const detail = details[0] || {};

    console.log("", detail);

    return {
      id: user.id,
      fullName: detail.name || '',
      email: user.email,
      role: user.role,
      photoUrl: detail.photoUrl || '',
      phoneNumber: detail.phoneNumber || '',
      address: detail.address || ''
    };
  }

}
