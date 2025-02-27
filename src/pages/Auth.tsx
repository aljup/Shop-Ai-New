
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isNewPassword, setIsNewPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    newPassword: "",
    confirmPassword: "",
  });

  // تحقق مما إذا كان المستخدم يأتي من رابط إعادة تعيين كلمة المرور
  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.replace('#', ''));
    const searchParams = new URLSearchParams(location.search);
    
    // تحقق من وجود معلمات إعادة تعيين كلمة المرور في عنوان URL
    const type = hashParams.get('type');
    const resetParam = searchParams.get("reset");
    
    if (type === 'recovery' || resetParam === "true") {
      setIsNewPassword(true);
      setIsLogin(false);
      setIsResetPassword(false);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // إذا كان المستخدم يقوم بتعيين كلمة مرور جديدة
      if (isNewPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast({
            variant: "destructive",
            title: "خطأ",
            description: "كلمتي المرور غير متطابقتين",
          });
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password: formData.newPassword
        });

        if (error) throw error;
        
        toast({
          title: "تم تغيير كلمة المرور بنجاح",
          description: "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة",
        });
        
        setIsNewPassword(false);
        setIsLogin(true);
        setFormData({
          ...formData,
          newPassword: "",
          confirmPassword: "",
          password: "",
        });
        return;
      }

      // إذا كان المستخدم يطلب إعادة تعيين كلمة المرور
      if (isResetPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: window.location.origin + "/auth",
        });
        
        if (error) throw error;
        
        toast({
          title: "تم إرسال رابط إعادة تعيين كلمة المرور",
          description: "يرجى التحقق من بريدك الإلكتروني",
        });
        
        setIsResetPassword(false);
        setIsLogin(true);
        return;
      }
      
      // إذا كان المستخدم يقوم بتسجيل الدخول
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast({
          title: "تم تسجيل الدخول بنجاح",
        });
        navigate("/profile");
      } else {
        // إذا كان المستخدم يقوم بإنشاء حساب جديد
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        });
        if (error) throw error;
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى تأكيد بريدك الإلكتروني",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message,
      });
    }
  };

  const renderAuthForm = () => {
    // نموذج إدخال كلمة مرور جديدة
    if (isNewPassword) {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="أدخل كلمة المرور الجديدة"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="أعد إدخال كلمة المرور الجديدة"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full">
            تغيير كلمة المرور
          </Button>
        </form>
      );
    }

    // نموذج طلب إعادة تعيين كلمة المرور
    if (isResetPassword) {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full">
            إرسال رابط إعادة تعيين كلمة المرور
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => setIsResetPassword(false)}
              className="hover:text-primary"
            >
              العودة إلى تسجيل الدخول
            </button>
          </div>
        </form>
      );
    }

    // نموذج تسجيل الدخول أو إنشاء حساب
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              placeholder="ادخل اسمك"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            placeholder="ادخل بريدك الإلكتروني"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            placeholder="ادخل كلمة المرور"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        {isLogin && (
          <div className="text-left text-sm">
            <button
              type="button"
              onClick={() => setIsResetPassword(true)}
              className="text-primary hover:underline"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
        )}
        <Button type="submit" className="w-full">
          {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="hover:text-primary"
          >
            {isLogin
              ? "ليس لديك حساب؟ إنشاء حساب"
              : "لديك حساب؟ تسجيل الدخول"}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-24 px-4">
      <div className="max-w-md mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate("/")}
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          رجوع
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>
              {isNewPassword 
                ? "تغيير كلمة المرور"
                : isResetPassword 
                  ? "استعادة كلمة المرور" 
                  : isLogin 
                    ? "تسجيل الدخول" 
                    : "إنشاء حساب"
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderAuthForm()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
