export class ProfileApi {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  async getProfile(userId) {
    if (!userId) throw new Error('User ID is required for fetching profile.');

    try {

      const userResponse = await fetch(`${this.baseUrl}/users/${userId}`);
      const user = await userResponse.json();
      const detailResponse = await fetch(`${this.baseUrl}/user_details?userId=${userId}`);
      const details = await detailResponse.json();
      const detail = details[0] || {};

      console.log("📄 Detalle obtenido:", detail);

      return {
        id: user.id,
        fullName: detail.name || '',
        email: user.email,
        role: user.role,
        photoUrl: detail.photoUrl || '',
        phoneNumber: detail.phoneNumber || '',
        address: detail.address || ''
      };

    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }


  async updateProfile(userId, updatedData) {
    if (!userId) throw new Error('User ID is required for updating profile.');

    try {
      const detailResponse = await fetch(`${this.baseUrl}/user_details?userId=${userId}`);
      if (!detailResponse.ok) {
        throw new Error(`Error buscando el detalle del usuario (status ${detailResponse.status}).`);
      }

      const details = await detailResponse.json();
      const detail = details[0];

      if (!detail || !detail.id) {
        throw new Error(`No se encontró el detalle del usuario con userId=${userId}`);
      }

      const response = await fetch(`${this.baseUrl}/user_details/${detail.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });


      const data = await response.json();
      console.log("", data);
      return data;

    } catch (error) {
      console.error('', error);
      throw error;
    }
  }
}
