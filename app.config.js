module.exports = {
  expo: {
    name: 'SpoedMarktplaats',
    slug: 'spoedmarktplaats',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#FF6B00',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'org.reactjs.native.example.SpoedMarktplaats',
      infoPlist: {
        NSCameraUsageDescription:
          'This app requires access to the camera to take photos for job completion verification.',
        NSPhotoLibraryUsageDescription:
          'This app requires access to the photo library to select images for job completion verification.',
        NSPhotoLibraryAddUsageDescription:
          'This app requires access to save photos to your photo library.',
        NSLocationWhenInUseUsageDescription:
          'This app requires access to your location to show nearby jobs.',
      },
    },
    android: {
      package: 'com.spoedmarktplaats',
      versionCode: 1,
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'ACCESS_FINE_LOCATION',
      ],
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FF6B00',
      },
    },
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission:
            'This app requires access to the photo library to select images for job completion verification.',
          cameraPermission:
            'This app requires access to the camera to take photos for job completion verification.',
        },
      ],
    ],
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
      wsUrl: process.env.WS_URL || 'ws://localhost:3000/chat',
      environment: process.env.ENVIRONMENT || 'development',
    },
  },
};
