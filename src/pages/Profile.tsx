
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockKeyhole, User } from "lucide-react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "كلمة المرور الحالية يجب أن تكون على الأقل 6 أحرف"),
  newPassword: z.string().min(6, "كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف"),
  confirmPassword: z.string().min(6, "تأكيد كلمة المرور يجب أن تكون على الأقل 6 أحرف"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمة المرور الجديدة وتأكيدها غير متطابقين",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    avatar_url: "",
    updated_at: null,
    id: "",
  });
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  useEffect(() => {
    checkUser();
    // تحقق من وجود هاش في العنوان وتعيين التبويب المناسب
    const hash = window.location.hash;
    if (hash === '#security') {
      setActiveTab('security');
    }
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    // Get user profile from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (profile) {
      setProfile(profile);
    } else {
      setProfile({
        id: user.id,
        name: "",
        phone: "",
        avatar_url: "",
        updated_at: null
      });
    }
  };

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          updated_at: new Date()
        });

      if (error) throw error;
      
      toast({
        title: "تم تحديث الملف الشخصي بنجاح"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في تحديث الملف الشخصي",
        description: error.message
      });
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('يرجى اختيار صورة');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: data.publicUrl });
      
      toast({
        title: "تم رفع الصورة بنجاح"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في رفع الصورة",
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const resendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });
      if (error) throw error;
      toast({
        title: "تم إرسال رابط التفعيل",
        description: "يرجى التحقق من بريدك الإلكتروني"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message
      });
    }
  };

  // نموذج تغيير كلمة المرور
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      // التحقق من كلمة المرور الحالية
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });
      
      if (signInError) {
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "كلمة المرور الحالية غير صحيحة",
        });
        return;
      }
      
      // تحديث كلمة المرور
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: "تم تغيير كلمة المرور بنجاح",
      });
      
      passwordForm.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في تغيير كلمة المرور",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
              <div className="flex items-center mt-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name || user?.email}`} />
                    <AvatarFallback>{profile.name?.[0] || user?.email?.[0]}</AvatarFallback>
                  </Avatar>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="mr-4">
                  <h2 className="text-2xl font-bold">{profile.name || "لم يتم تحديد الاسم"}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">معرف العضو: {user?.id}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    معلومات الحساب
                  </TabsTrigger>
                  <TabsTrigger id="security-tab" value="security" className="flex items-center gap-2">
                    <LockKeyhole className="h-4 w-4" />
                    الأمان
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-4">
                  {!user?.email_confirmed_at && (
                    <div className="bg-yellow-100 p-4 rounded-lg mb-4">
                      <p className="text-yellow-800">لم يتم تفعيل حسابك بعد</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={resendVerification}
                      >
                        إعادة إرسال رابط التفعيل
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label>الاسم</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label>البريد الإلكتروني</label>
                    <Input
                      value={user?.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label>رقم الهاتف</label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>

                  <Button onClick={updateProfile} className="w-full">
                    حفظ التغييرات
                  </Button>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">تغيير كلمة المرور</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>كلمة المرور الحالية</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="أدخل كلمة المرور الحالية" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>كلمة المرور الجديدة</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="أدخل كلمة المرور الجديدة" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>تأكيد كلمة المرور</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="أعد إدخال كلمة المرور الجديدة" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="w-full">
                            تغيير كلمة المرور
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
