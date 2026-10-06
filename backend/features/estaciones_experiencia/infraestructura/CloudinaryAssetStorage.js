const crypto = require('crypto');

class CloudinaryAssetStorage {
  constructor({
    cloudName = process.env.CLOUDINARY_CLOUD_NAME,
    apiKey = process.env.CLOUDINARY_API_KEY,
    apiSecret = process.env.CLOUDINARY_API_SECRET,
    folder = process.env.CLOUDINARY_ASSET_FOLDER || 'mariposas',
  } = {}) {
    this.cloudName = cloudName;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.folder = folder;
  }

  estaConfigurado() {
    return Boolean(this.cloudName && this.apiKey && this.apiSecret);
  }

  async subirDataUri(dataUri, { publicId } = {}) {
    if (!this.estaConfigurado()) {
      throw new Error('Cloudinary no está configurado. Define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      folder: this.folder,
      timestamp,
    };
    if (publicId) params.public_id = publicId;

    const signature = this.firmar(params);
    const body = new FormData();
    body.append('file', dataUri);
    body.append('api_key', this.apiKey);
    body.append('timestamp', String(timestamp));
    body.append('folder', this.folder);
    body.append('signature', signature);
    if (publicId) body.append('public_id', publicId);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error?.message || `Cloudinary rechazó la imagen (${response.status}).`);
    }

    return {
      url: payload.secure_url || payload.url,
      publicId: payload.public_id,
      formato: payload.format,
      ancho: payload.width,
      alto: payload.height,
      bytes: payload.bytes,
    };
  }

  firmar(params) {
    const canonical = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return crypto.createHash('sha1').update(`${canonical}${this.apiSecret}`).digest('hex');
  }
}

module.exports = { CloudinaryAssetStorage };
