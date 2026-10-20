import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { signInWithGoogle } from '../api/auth';
import type { Account } from '../types/event';

WebBrowser.maybeCompleteAuthSession();

type GoogleSignInOptions = {
  onSuccess: (account: Account) => void;
  onError: (message: string) => void;
};

export function useGoogleSignIn({ onSuccess, onError }: GoogleSignInOptions) {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  const isConfigured = Boolean(webClientId);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId ?? 'missing-google-client-id',
    webClientId: webClientId ?? 'missing-google-client-id',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (!response) return;
    if (response.type === 'cancel' || response.type === 'dismiss') return;
    if (response.type !== 'success') {
      onError('Google sign-in could not be completed.');
      return;
    }

    const idToken = response.authentication?.idToken ?? response.params?.id_token;
    if (!idToken) {
      onError('Google did not return an identity token.');
      return;
    }

    void signInWithGoogle(idToken).then(onSuccess).catch((error: unknown) => {
      onError(error instanceof Error ? error.message : 'Could not sign in with Google.');
    });
  }, [onError, onSuccess, response]);

  return {
    isConfigured,
    isReady: isConfigured && Boolean(request),
    signIn: () => {
      if (!isConfigured || !request) {
        onError('Google sign-in is not configured.');
        return;
      }
      void promptAsync();
    },
  };
}