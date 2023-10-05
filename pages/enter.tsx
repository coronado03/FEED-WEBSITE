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

    useEffect(()=>{
        if (username && user) 
            router.push('/')
    },[username, user])

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
            <section className='flex flex-col items-center text-white mt-5'>
                <h3 className='text-4xl'><strong>Choose Username</strong></h3>
                <form className="mt-5" onSubmit={onSubmit}>

                    <div className='flex flex-col md:flex-row gap-x-5 mt-10'>
                        <input className='text-black focus:outline-none p-4' name="username" placeholder="username" value={formValue} onChange={onChange} />
                        
                        <button type="submit" className={`transition-all ease-in-out delay-75 ${isValid ? "" : "text-gray-500"}`} disabled={!isValid}>
                            Accept Username
                        </button>
                    </div>

                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />



  
                    

                    <h3 className='mt-4'>Debug State</h3>
                    <div className='text-gray-500'>
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
        return <p> <strong>{username}</strong> is available</p>

    } else if (username && !isValid) {
        return <p><strong>{username}</strong> is taken!</p>
    } else {
        return <p></p>

    }

}