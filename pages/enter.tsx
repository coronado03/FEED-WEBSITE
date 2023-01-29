import { auth, googleAuthProvider, firestore } from '../lib/firebase'
import { signInWithPopup, signOut} from 'firebase/auth';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import debounce from 'lodash.debounce';

import { GrGoogle } from 'react-icons/gr';
import { useRouter } from 'next/router';


export default function EnterPage (props) {
    const { user, username } = useContext(UserContext)
    
    const router = useRouter()

    //Redirects to home at log in. WIP
    //if (user) {
    //   router.push("/")
    //}

    return(
        <main>
            {user ?
                (!username ? <UsernameForm /> : <SignOutButton />)
                :
                <SignInButton />
            }
        </main>
        

    )
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    };

    return (
        <div className='flex flex-col w-screen mt-5'>
            <h1 className='text-white text-center text-4xl'><strong>Welcome to FEED</strong></h1>
            <h4 className='text-gray-500 text-center'>Where all IT enthusiasts can connect!</h4>
            <div className='flex flex-col gap-y-5 self-center w-10/12 lg:w-5/12	 mt-4'>
                <button className='flex flex-row gap-x-4 bg-white py-2 px-4 rounded-md items-center self-center w-full' onClick={signInWithGoogle}>
                <GrGoogle size="1.4rem"/> 
                <p className='justify-self-end text-lg'><b>Log in with Google</b></p>
                </button>
            </div>

        </div>

    )

}

function SignOutButton() {
 

    return (
        <>
            <div className='flex flex-col w-screen mt-5'>
                <button className='flex flex-row gap-x-4 bg-white py-2 px-4 rounded-md items-center self-center w-full' onClick={() => auth.signOut()}>Sign Out</button>
            </div>
        </>
    )
    
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext)

    useEffect(() => {
        checkUsername(formValue)
    }, [formValue])
    

    const onSubmit = async (e) => {
        e.preventDefault();
    
        // Create refs for both documents
        const userDoc = doc(firestore, `users/${user.uid}`);

        const usernameDoc = doc(firestore, `usernames/${formValue}`);
    
        // Commit both docs together as a batch write.
        const batch = writeBatch(firestore);
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });
    
        await batch.commit();
      };

    const onChange = (e) => {

        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            console.log('short username')
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);   
        }

    };

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = doc(firestore, 'usernames', `${username}`);
                const  docsnap = await getDoc(ref);
                if (!docsnap.exists()) {
                    console.log('docsnap exists?')
                    setIsValid(true);
                }

                setLoading(false);
                console.log(docsnap.data());
                console.log('Firestore read executed!');

            }
        }, 500),
        []
    );
    


    return (
        !username && (
            <section className='text-white'>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>

                    <input className='text-black' name="username" placeholder="username" value={formValue} onChange={onChange} />

                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />


                    <button type="submit" className='' disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Validity: {isValid.toString()}
                    </div>




                </form>
            </section>
        )
    )
    
}

function UsernameMessage({ username, isValid, loading}) {
    if (loading) {
        return <p>checking...</p>

    } else if (isValid) {
        return <p>{username} is available</p>

    } else if (username && !isValid) {
        return <p>{username} is taken!</p>
    } else {
        return <p></p>

    }

}