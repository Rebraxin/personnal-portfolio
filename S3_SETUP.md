# Configuration S3 pour Payload

## 📋 Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env.local` :

```bash
# S3 Configuration
S3_BUCKET=your-bucket-name
S3_REGION=your-region (ex: eu-west-1, us-east-1)
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key

# Optionnel : pour providers non-AWS (DigitalOcean Spaces, etc.)
S3_ENDPOINT=https://your-region.digitaloceanspaces.com
```

## 🔧 Configuration du bucket S3

### Permissions IAM (AWS)

Créez un utilisateur IAM avec les permissions suivantes :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::your-bucket-name", "arn:aws:s3:::your-bucket-name/*"]
    }
  ]
}
```

### Configuration CORS

Ajoutez cette configuration CORS à votre bucket :

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### Policy du bucket (optionnel - pour images publiques)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/media/*"
    }
  ]
}
```

## 🚀 Déploiement

1. **Ajoutez les variables d'environnement** à Vercel
2. **Redéployez** l'application
3. **Uploadez de nouvelles images** via l'admin Payload
4. **Les anciennes images** dans `public/media` peuvent être supprimées

## ✅ Test

Après configuration, les URLs d'images devraient ressembler à :

```
https://your-bucket.s3.your-region.amazonaws.com/media/filename.webp
```

Ou pour DigitalOcean Spaces :

```
https://your-bucket.your-region.digitaloceanspaces.com/media/filename.webp
```
