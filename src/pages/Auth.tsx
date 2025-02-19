
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add authentication logic here
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-background pt-24 px-4">
      <div className="max-w-md mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          رجوع
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? "تسجيل الدخول" : "إنشاء حساب"}</CardTitle>
          </CardHeader>
          <CardContent>
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
                />
              </div>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
