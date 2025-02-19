
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    email: "",
    phone: "",
  });
  
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
    }
  };

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
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
            </CardHeader>
            <CardContent className="space-y-4">
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
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
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
