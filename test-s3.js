#!/usr/bin/env node

// Test script to validate S3 configuration
// Usage: node test-s3.js

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const requiredEnvVars = ['S3_BUCKET', 'S3_REGION', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY']

// Check that all required variables are present
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])
if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:', missingVars.join(', '))
  console.log('Please add them to your .env.local file')
  process.exit(1)
}

// S3 Configuration
const s3Config = {
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: process.env.S3_REGION,
}

// Add endpoint if defined (for non-AWS providers)
if (process.env.S3_ENDPOINT) {
  s3Config.endpoint = process.env.S3_ENDPOINT
  s3Config.forcePathStyle = true
}

const s3Client = new S3Client(s3Config)

async function testS3Connection() {
  try {
    console.log('🔍 Testing S3 connection...')
    console.log(`Bucket: ${process.env.S3_BUCKET}`)
    console.log(`Region: ${process.env.S3_REGION}`)
    if (process.env.S3_ENDPOINT) {
      console.log(`Endpoint: ${process.env.S3_ENDPOINT}`)
    }

    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET,
      MaxKeys: 5,
      Prefix: 'media/',
    })

    const response = await s3Client.send(command)

    console.log('✅ S3 connection successful!')
    console.log(`📁 Objects found: ${response.KeyCount || 0}`)

    if (response.Contents && response.Contents.length > 0) {
      console.log('🖼️  Example files:')
      response.Contents.slice(0, 3).forEach((obj) => {
        console.log(`   - ${obj.Key}`)
      })
    } else {
      console.log('ℹ️  No media files found (normal if first deployment)')
    }
  } catch (error) {
    console.error('❌ S3 connection error:', error.message)

    if (error.name === 'InvalidAccessKeyId') {
      console.log('💡 Check your S3_ACCESS_KEY_ID')
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.log('💡 Check your S3_SECRET_ACCESS_KEY')
    } else if (error.name === 'NoSuchBucket') {
      console.log('💡 Make sure the bucket exists and the region is correct')
    }

    process.exit(1)
  }
}

testS3Connection()
