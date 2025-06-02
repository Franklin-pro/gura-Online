
import { useState } from 'react';
import { useToast,toast } from '@/components/ui/use-toast';
import { Navigate } from 'react-router-dom';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [user,setUser] = useState(null);

    const login = async (email: string, password: string) => {
        const success = handleInputError(email, password);
        if (!success) return false;

        setLoading(true);
        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data.user));
            if (response.ok) {
                toast({
                    title: 'Login Successful',
                    description: 'You have successfully logged in.',
                    variant: 'default',
                });
                return true;
            } else {
                toast({
                    title: 'Login Failed',
                    description: data.message || 'Invalid email or password.',
                    variant: 'destructive',
                });
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            toast({
                title: 'Login Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
            return false;
        } finally {
            setLoading(false);
        }
    }
    const logout = async() => {
        try {
            await fetch('/api/v1/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            setUser(null);
            toast({
                title: 'Logout Successful',
                description: 'You have successfully logged out.',
                variant: 'default',
            });
            return true;
           
		} catch (error) {
            console.error('Logout error:', error);
            toast({
                title: 'Logout Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
		}
    }

    return { loading, login,logout,user };
}

function handleInputError(email: string, password: string) {
    if (!email || !password) {
        toast({
            title: 'Missing Fields',
            description: 'Please fill in all fields',
            variant: 'destructive',
        });
        return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
        toast({
            title: 'Invalid Email',
            description: 'Please enter a valid email address',
            variant: 'destructive',
        });
        return false;
    }
    
    if (password.length < 6) {
        toast({
            title: 'Password Too Short',
            description: 'Password must be at least 6 characters',
            variant: 'destructive',
        });
        return false;
    }
    
    return true;
}

export default useLogin;