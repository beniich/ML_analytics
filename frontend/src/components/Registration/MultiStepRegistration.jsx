import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import zxcvbn from 'zxcvbn';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

// Validation Schema
const step1Schema = z.object({
  username: z.string().min(3, 'Le nom d\\'utilisateur doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères')
});

const MultiStepRegistration = () => {
  const [step, setStep] = useState(1);
  const [pwdScore, setPwdScore] = useState(0);
  const [userData, setUserData] = useState(null);
  const [totpData, setTotpData] = useState(null);
  
  // React Hook Form for Step 1
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(step1Schema)
  });

  const passwordValue = watch("password", "");
  
  // Update password score live
  React.useEffect(() => {
    if (passwordValue) {
      setPwdScore(zxcvbn(passwordValue).score);
    } else {
      setPwdScore(0);
    }
  }, [passwordValue]);

  const onStep1Submit = async (data) => {
    try {
      const res = await axios.post('/api/auth/register', data);
      setUserData({ ...data, id: res.data.user_id });
      setStep(2);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Registration failed");
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;
    try {
      const res = await axios.post(`/api/auth/verify-email?email=${userData.email}&otp=${otp}`);
      // Store token
      localStorage.setItem('access_token', res.data.access_token);
      
      // Request TOTP Setup
      const totpRes = await axios.post('/api/auth/setup-totp', {}, {
        headers: { Authorization: `Bearer ${res.data.access_token}` }
      });
      setTotpData(totpRes.data);
      setStep(3);
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  const handleVerifyTOTP = async (e) => {
    e.preventDefault();
    const code = e.target.totp.value;
    try {
      await axios.post(`/api/auth/verify-totp?code=${code}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setStep(4);
    } catch (err) {
      alert("Invalid TOTP Code");
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    const wsName = e.target.workspace.value;
    try {
      await axios.post(`/api/auth/onboarding/workspace?workspace_name=${wsName}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      alert("Onboarding Complete!");
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Workspace creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl glassmorphism border border-gray-700 w-full max-w-md">
        
        {/* STEP 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={handleSubmit(onStep1Submit)} className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-emerald-400">Créer un compte</h2>
            
            <div>
              <label className="block text-sm text-gray-400">Username</label>
              <input {...register("username")} className="w-full mt-1 p-2 bg-gray-700 rounded border border-gray-600 focus:border-emerald-500" />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-400">Email</label>
              <input type="email" {...register("email")} className="w-full mt-1 p-2 bg-gray-700 rounded border border-gray-600 focus:border-emerald-500" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-400">Password</label>
              <input type="password" {...register("password")} className="w-full mt-1 p-2 bg-gray-700 rounded border border-gray-600 focus:border-emerald-500" />
              
              {/* Password Strength Indicator */}
              <div className="h-2 w-full bg-gray-700 mt-2 rounded flex">
                {[0,1,2,3].map(i => (
                  <div key={i} className={`flex-1 ${i < pwdScore ? (pwdScore > 2 ? 'bg-emerald-500' : 'bg-yellow-500') : 'bg-transparent'} border-r border-gray-800 rounded`}></div>
                ))}
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded transition-colors mt-6">
              Suivant
            </button>
          </form>
        )}

        {/* STEP 2: Email Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyEmail} className="space-y-4 text-center">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Vérification Email</h2>
            <p className="text-sm text-gray-400 mb-4">Un code a été envoyé à {userData.email} (Pour le test: tapez 123456)</p>
            <input name="otp" required className="w-full p-2 bg-gray-700 rounded text-center tracking-widest text-lg" placeholder="000000" />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded mt-6">Vérifier</button>
          </form>
        )}

        {/* STEP 3: TOTP Setup */}
        {step === 3 && totpData && (
          <form onSubmit={handleVerifyTOTP} className="space-y-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2 text-emerald-400">Sécurisation 2FA</h2>
            <p className="text-sm text-gray-400 mb-4 text-center">Scannez ce QR code avec Google Authenticator</p>
            
            <div className="bg-white p-4 rounded-lg mb-4 inline-block">
              <QRCodeSVG value={totpData.provisioning_uri} size={150} />
            </div>
            
            <input name="totp" required className="w-full p-2 bg-gray-700 rounded text-center tracking-widest text-lg" placeholder="Code 6 chiffres" />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded mt-6">Activer 2FA</button>
          </form>
        )}

        {/* STEP 4: Workspace Onboarding */}
        {step === 4 && (
          <form onSubmit={handleCreateWorkspace} className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Dernière Étape !</h2>
            <p className="text-sm text-gray-400 mb-4">Créez votre premier espace de travail pour collaborer avec l'IA.</p>
            
            <label className="block text-sm text-gray-400">Nom du Workspace</label>
            <input name="workspace" required className="w-full mt-1 p-2 bg-gray-700 rounded border border-gray-600" defaultValue="Mon Espace" />
            
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded mt-6">Aller au tableau de bord</button>
          </form>
        )}

      </div>
    </div>
  );
};

export default MultiStepRegistration;
