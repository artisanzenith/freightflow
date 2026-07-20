import { Redirect } from 'expo-router';

/**
 * Entry route. Sends users into the driver app's default tab. When
 * authentication is added, this is where the signed-in/signed-out branch will
 * live (redirecting to a login flow when there is no session).
 */
export default function Index() {
  return <Redirect href="/home" />;
}
