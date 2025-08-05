'use client'

import { useState } from 'react'
import { createClient } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import Toast from '@/components/Toast'
import { Camera, Video, MapPin, Phone, Mail, User, Shield, Settings, ChevronRight, ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface RegistrationData {
  // Étape 1 - Informations essentielles
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  
  // Étape 2 - Profil professionnel
  businessName: string
  specialization: string[]
  experience: string
  location: string
  phone: string
  website: string
  
  // Étape 3 - Préférences
  communicationPrefs: string[]
  marketingConsent: boolean
  termsAccepted: boolean
  privacyAccepted: boolean
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('signin')
  const [registrationStep, setRegistrationStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const router = useRouter()
  const supabase = createClient()

  // États pour la connexion
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  // États pour l'inscription
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    businessName: '',
    specialization: [],
    experience: '',
    location: '',
    phone: '',
    website: '',
    communicationPrefs: [],
    marketingConsent: false,
    termsAccepted: false,
    privacyAccepted: false
  })

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    })

    if (error) {
      setToastType('error')
      setToast(error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!registrationData.email) newErrors.email = 'Email requis'
      if (!registrationData.firstName) newErrors.firstName = 'Prénom requis'
      if (!registrationData.lastName) newErrors.lastName = 'Nom requis'
      if (!registrationData.password) newErrors.password = 'Mot de passe requis'
      if (registrationData.password.length < 8) newErrors.password = 'Minimum 8 caractères'
      if (registrationData.password !== registrationData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
      }
    }

    if (step === 2) {
      if (!registrationData.businessName) newErrors.businessName = 'Nom de l\'entreprise requis'
      if (registrationData.specialization.length === 0) newErrors.specialization = 'Sélectionnez au moins une spécialisation'
      if (!registrationData.experience) newErrors.experience = 'Niveau d\'expérience requis'
    }

    if (step === 3) {
      if (!registrationData.termsAccepted) newErrors.terms = 'Vous devez accepter les conditions'
      if (!registrationData.privacyAccepted) newErrors.privacy = 'Vous devez accepter la politique de confidentialité'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    setPasswordStrength(strength)
  }

  const handlePasswordChange = (value: string) => {
    setRegistrationData(prev => ({ ...prev, password: value }))
    calculatePasswordStrength(value)
  }

  const nextStep = () => {
    if (validateStep(registrationStep)) {
      setRegistrationStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setRegistrationStep(prev => Math.max(prev - 1, 1))
  }

  const handleRegistration = async () => {
    if (!validateStep(3)) return

    setLoading(true)
    
    const { error } = await supabase.auth.signUp({
      email: registrationData.email,
      password: registrationData.password,
      options: {
        data: {
          first_name: registrationData.firstName,
          last_name: registrationData.lastName,
          business_name: registrationData.businessName,
          specialization: registrationData.specialization,
          experience: registrationData.experience,
          location: registrationData.location,
          phone: registrationData.phone,
          website: registrationData.website,
          communication_prefs: registrationData.communicationPrefs,
          marketing_consent: registrationData.marketingConsent
        }
      }
    })

    if (error) {
      setToastType('error')
      setToast(error.message)
    } else {
      setShowConfirmation(true)
    }
    setLoading(false)
  }

  const toggleSpecialization = (spec: string) => {
    setRegistrationData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }))
  }

  const toggleCommunicationPref = (pref: string) => {
    setRegistrationData(prev => ({
      ...prev,
      communicationPrefs: prev.communicationPrefs.includes(pref)
        ? prev.communicationPrefs.filter(p => p !== pref)
        : [...prev.communicationPrefs, pref]
    }))
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500'
    if (passwordStrength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Très faible'
    if (passwordStrength < 50) return 'Faible'
    if (passwordStrength < 75) return 'Moyen'
    return 'Fort'
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Vérifiez votre email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Nous avons envoyé un lien de confirmation à :
            </p>
            <p className="font-semibold text-primary">
              {registrationData.email}
            </p>
            <p className="text-sm text-muted-foreground">
              Cliquez sur le lien dans l'email pour activer votre compte et commencer à utiliser BKR STUDIO APP.
            </p>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm">
                <strong>Vous ne voyez pas l'email ?</strong>
              </p>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>• Vérifiez votre dossier spam/courrier indésirable</li>
                <li>• L'email peut prendre quelques minutes à arriver</li>
                <li>• Assurez-vous que l'adresse email est correcte</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmation(false)
                setRegistrationStep(1)
                setRegistrationData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  firstName: '',
                  lastName: '',
                  businessName: '',
                  specialization: [],
                  experience: '',
                  location: '',
                  phone: '',
                  website: '',
                  communicationPrefs: [],
                  marketingConsent: false,
                  termsAccepted: false,
                  privacyAccepted: false
                })
              }}
              className="w-full"
            >
              Créer un autre compte
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('signin')}
              className="w-full"
            >
              Retour à la connexion
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">BKR STUDIO APP</CardTitle>
          <p className="text-muted-foreground">Gestion pour photographes et vidéastes</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Mot de passe</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <div className="space-y-6">
                {/* Indicateur de progression */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Étape {registrationStep} sur 3</span>
                    <span>{Math.round((registrationStep / 3) * 100)}%</span>
                  </div>
                  <Progress value={(registrationStep / 3) * 100} className="w-full" />
                </div>

                <AnimatePresence mode="wait">
                  {registrationStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-4"
                    >
                      <div className="text-center mb-6">
                        <User className="mx-auto h-12 w-12 text-primary mb-2" />
                        <h3 className="text-lg font-semibold">Informations personnelles</h3>
                        <p className="text-sm text-muted-foreground">Créons votre compte professionnel</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom *</Label>
                          <Input
                            id="firstName"
                            value={registrationData.firstName}
                            onChange={(e) => setRegistrationData(prev => ({ ...prev, firstName: e.target.value }))}
                            className={errors.firstName ? 'border-red-500' : ''}
                          />
                          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom *</Label>
                          <Input
                            id="lastName"
                            value={registrationData.lastName}
                            onChange={(e) => setRegistrationData(prev => ({ ...prev, lastName: e.target.value }))}
                            className={errors.lastName ? 'border-red-500' : ''}
                          />
                          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email professionnel *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={registrationData.email}
                          onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={registrationData.password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            className={errors.password ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {registrationData.password && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                                  style={{ width: `${passwordStrength}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{getPasswordStrengthText()}</span>
                            </div>
                          </div>
                        )}
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={registrationData.confirmPassword}
                            onChange={(e) => setRegistrationData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className={errors.confirmPassword ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                      </div>
                    </motion.div>
                  )}

                  {registrationStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-4"
                    >
                      <div className="text-center mb-6">
                        <Camera className="mx-auto h-12 w-12 text-primary mb-2" />
                        <h3 className="text-lg font-semibold">Profil professionnel</h3>
                        <p className="text-sm text-muted-foreground">Parlez-nous de votre activité</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessName">Nom de l'entreprise/Studio *</Label>
                        <Input
                          id="businessName"
                          value={registrationData.businessName}
                          onChange={(e) => setRegistrationData(prev => ({ ...prev, businessName: e.target.value }))}
                          placeholder="Ex: Studio Photo Martin"
                          className={errors.businessName ? 'border-red-500' : ''}
                        />
                        {errors.businessName && <p className="text-sm text-red-500">{errors.businessName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Spécialisations * (sélectionnez toutes celles qui s'appliquent)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'wedding', label: 'Mariage', icon: '💒' },
                            { id: 'portrait', label: 'Portrait', icon: '👤' },
                            { id: 'event', label: 'Événementiel', icon: '🎉' },
                            { id: 'corporate', label: 'Corporate', icon: '🏢' },
                            { id: 'product', label: 'Produit', icon: '📦' },
                            { id: 'video', label: 'Vidéo', icon: '🎬' }
                          ].map((spec) => (
                            <div key={spec.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={spec.id}
                                checked={registrationData.specialization.includes(spec.id)}
                                onCheckedChange={() => toggleSpecialization(spec.id)}
                              />
                              <Label htmlFor={spec.id} className="flex items-center gap-2 cursor-pointer">
                                <span>{spec.icon}</span>
                                {spec.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {errors.specialization && <p className="text-sm text-red-500">{errors.specialization}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Niveau d'expérience *</Label>
                        <Select
                          value={registrationData.experience}
                          onValueChange={(value) => setRegistrationData(prev => ({ ...prev, experience: value }))}
                        >
                          <SelectTrigger className={errors.experience ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Sélectionnez votre niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Débutant (moins de 2 ans)</SelectItem>
                            <SelectItem value="intermediate">Intermédiaire (2-5 ans)</SelectItem>
                            <SelectItem value="advanced">Avancé (5-10 ans)</SelectItem>
                            <SelectItem value="expert">Expert (plus de 10 ans)</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Localisation</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="location"
                              value={registrationData.location}
                              onChange={(e) => setRegistrationData(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="Ville, Région"
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              value={registrationData.phone}
                              onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+33 6 12 34 56 78"
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Site web (optionnel)</Label>
                        <Input
                          id="website"
                          type="url"
                          value={registrationData.website}
                          onChange={(e) => setRegistrationData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://votre-site.com"
                        />
                      </div>
                    </motion.div>
                  )}

                  {registrationStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-4"
                    >
                      <div className="text-center mb-6">
                        <Settings className="mx-auto h-12 w-12 text-primary mb-2" />
                        <h3 className="text-lg font-semibold">Préférences et finalisation</h3>
                        <p className="text-sm text-muted-foreground">Dernières étapes avant de commencer</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Préférences de communication (optionnel)</Label>
                          <div className="space-y-2">
                            {[
                              { id: 'email_updates', label: 'Mises à jour par email' },
                              { id: 'sms_reminders', label: 'Rappels SMS' },
                              { id: 'newsletter', label: 'Newsletter mensuelle' }
                            ].map((pref) => (
                              <div key={pref.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={pref.id}
                                  checked={registrationData.communicationPrefs.includes(pref.id)}
                                  onCheckedChange={() => toggleCommunicationPref(pref.id)}
                                />
                                <Label htmlFor={pref.id} className="cursor-pointer">
                                  {pref.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="marketing"
                              checked={registrationData.marketingConsent}
                              onCheckedChange={(checked) => setRegistrationData(prev => ({ ...prev, marketingConsent: checked as boolean }))}
                            />
                            <Label htmlFor="marketing" className="cursor-pointer text-sm">
                              J'accepte de recevoir des communications marketing personnalisées
                            </Label>
                          </div>
                        </div>

                        <div className="border-t pt-4 space-y-3">
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="terms"
                              checked={registrationData.termsAccepted}
                              onCheckedChange={(checked) => setRegistrationData(prev => ({ ...prev, termsAccepted: checked as boolean }))}
                              className={errors.terms ? 'border-red-500' : ''}
                            />
                            <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
                              J'accepte les <a href="#" className="text-primary underline">conditions d'utilisation</a> *
                            </Label>
                          </div>
                          {errors.terms && <p className="text-sm text-red-500 ml-6">{errors.terms}</p>}

                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="privacy"
                              checked={registrationData.privacyAccepted}
                              onCheckedChange={(checked) => setRegistrationData(prev => ({ ...prev, privacyAccepted: checked as boolean }))}
                              className={errors.privacy ? 'border-red-500' : ''}
                            />
                            <Label htmlFor="privacy" className="cursor-pointer text-sm leading-relaxed">
                              J'accepte la <a href="#" className="text-primary underline">politique de confidentialité</a> *
                            </Label>
                          </div>
                          {errors.privacy && <p className="text-sm text-red-500 ml-6">{errors.privacy}</p>}
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Récapitulatif de votre inscription</h4>
                          <div className="text-sm space-y-1 text-muted-foreground">
                            <p><strong>Nom :</strong> {registrationData.firstName} {registrationData.lastName}</p>
                            <p><strong>Email :</strong> {registrationData.email}</p>
                            <p><strong>Entreprise :</strong> {registrationData.businessName}</p>
                            <p><strong>Spécialisations :</strong> {registrationData.specialization.length} sélectionnée(s)</p>
                            <p><strong>Expérience :</strong> {registrationData.experience}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Boutons de navigation */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={registrationStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>

                  {registrationStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleRegistration}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      {loading ? 'Création...' : 'Créer mon compte'}
                      <Shield className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Toast message={toast} onClose={() => setToast(null)} type={toastType} />
    </div>
  )
}