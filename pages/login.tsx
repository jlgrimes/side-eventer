import { useRouter } from 'next/router';
import { Magic } from 'magic-sdk';
import { Button, Input } from '@chakra-ui/react';
import { useFormik } from 'formik';

export default function Login() {
  const router = useRouter();
  const handleSubmit = async event => {
    // the Magic code
    const did = await new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUB_KEY ?? ''
    ).auth.loginWithMagicLink({ email: event.email });

    // Once we have the did from magic, login with our own API
    const authRequest = await fetch('/api/login', {
      method: 'POST',
      headers: { Authorization: `Bearer ${did}` },
    });

    if (authRequest.ok) {
      // We successfully logged in, our API
      // set authorization cookies and now we
      // can redirect to the dashboard!
      router.push('/dashboard');
    } else {
      /* handle errors */
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Input
        name='email'
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      <Button type='submit'>Log in</Button>
    </form>
  );
}
