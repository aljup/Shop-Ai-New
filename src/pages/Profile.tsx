
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";

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
  
  useEffect(() => {
    checkUser();
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium">حالة الحساب</h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.email_confirmed_at ? "مفعل" : "غير مفعل"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium">تاريخ الانضمام</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user?.created_at).toLocaleDateString('ar')}
                  </p>
                </div>
              </div>
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
