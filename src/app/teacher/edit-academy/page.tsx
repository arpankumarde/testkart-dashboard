import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import getToken from "@/lib/getToken";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import type { AuthResponse } from "@/actions/auth";
import { Textarea } from "@/components/ui/textarea";
import { updateAcademy } from "@/actions/academy";
import { revalidatePath } from "next/cache";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  FileText,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  Send,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "./SubmitButton";

interface ApiResponse {
  success: boolean;
  data: {
    academy_id: number;
    academy_name: string;
    display_name: string;
    slug: string;
    logo: string | null;
    contact_email: string;
    website: string | null;
    contact_phone: string;
    about: string | null;
    yt: string | null;
    fb: string | null;
    ig: string | null;
    tw: string | null;
    tg: string | null;
    wp: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

interface Payload {
  academy_id: number;
  academy_name: string;
  display_name: string;
  slug: string;
  logo: string | null;
  contact_email: string;
  website: string | null;
  contact_phone: string;
  about: string | null;
  yt: string | null;
  fb: string | null;
  ig: string | null;
  tw: string | null;
  tg: string | null;
  wp: string | null;
}

const Page = async () => {
  try {
    const user = JSON.parse(
      (await getCookie("tkuser", { cookies })) as string
    ) as AuthResponse["data"];

    const { data }: { data: ApiResponse } = await api.get(
      `/api/v1/studio/academy/${user?.user?.academy?.academy_id}`,
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full pb-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Edit Academy Details</CardTitle>
            </div>
            <CardDescription>
              Update your academy information visible to students
            </CardDescription>
          </CardHeader>

          <form
            action={async (e) => {
              "use server";

              const formData = Object.fromEntries(e.entries());

              const payload: Payload = {
                academy_id: data?.data?.academy_id,
                academy_name: formData["academy_name"] as string,
                display_name: formData["display_name"] as string,
                slug: data?.data?.slug,
                logo: data.data.logo,
                contact_email: formData["contact_email"] as string,
                website: formData["website"] as string,
                contact_phone: formData["contact_phone"] as string,
                about: formData["about"] as string,
                yt: formData["yt"] as string,
                fb: formData["fb"] as string,
                ig: formData["ig"] as string,
                tw: formData["tw"] as string,
                tg: formData["tg"] as string,
                wp: formData["wp"] as string,
              };

              const updatedData = await updateAcademy(payload);

              if (!updatedData.success) {
                console.log(updatedData.error);
              }

              console.log("Academy Updated Successfully");
              revalidatePath("/teacher/edit-academy");
            }}
          >
            <CardContent className="p-6">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Basic Information
                    </h3>
                    <Separator className="mb-4" />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="academy_name"
                        className="flex items-center gap-2"
                      >
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Academy Name
                      </Label>
                      <Input
                        id="academy_name"
                        name="academy_name"
                        type="text"
                        defaultValue={data.data.academy_name}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="display_name"
                        className="flex items-center gap-2"
                      >
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Display Name
                      </Label>
                      <Input
                        id="display_name"
                        name="display_name"
                        type="text"
                        defaultValue={data.data.display_name}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="contact_email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Contact Email
                      </Label>
                      <Input
                        id="contact_email"
                        name="contact_email"
                        type="email"
                        defaultValue={data.data.contact_email}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="contact_phone"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Contact Phone
                      </Label>
                      <Input
                        id="contact_phone"
                        name="contact_phone"
                        type="tel"
                        defaultValue={data.data.contact_phone}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="website"
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://youracademy.com"
                        defaultValue={data.data.website ?? ""}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      About Academy
                    </Label>
                    <Textarea
                      id="about"
                      name="about"
                      defaultValue={data.data.about ?? ""}
                      rows={8}
                      placeholder="Describe your academy..."
                      className="resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Social Media Links
                    </h3>
                    <Separator className="mb-4" />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="yt" className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-muted-foreground" />
                        YouTube Channel
                      </Label>
                      <Input
                        id="yt"
                        name="yt"
                        type="url"
                        placeholder="https://youtube.com/c/youracademy"
                        defaultValue={data.data.yt ?? ""}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fb" className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-muted-foreground" />
                        Facebook Page
                      </Label>
                      <Input
                        id="fb"
                        name="fb"
                        type="url"
                        placeholder="https://facebook.com/youracademy"
                        defaultValue={data.data.fb ?? ""}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ig" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                        Instagram Page
                      </Label>
                      <Input
                        id="ig"
                        name="ig"
                        type="url"
                        placeholder="https://instagram.com/youracademy"
                        defaultValue={data?.data?.ig ?? ""}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tw" className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-muted-foreground" />
                        Twitter Page
                      </Label>
                      <Input
                        id="tw"
                        name="tw"
                        type="url"
                        placeholder="https://twitter.com/youracademy"
                        defaultValue={data.data.tw ?? ""}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tg" className="flex items-center gap-2">
                        <Send className="h-4 w-4 text-muted-foreground" />
                        Telegram Channel
                      </Label>
                      <Input
                        id="tg"
                        name="tg"
                        type="url"
                        placeholder="https://t.me/youracademy"
                        defaultValue={data.data.tg ?? ""}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wp" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        WhatsApp Group
                      </Label>
                      <Input
                        id="wp"
                        name="wp"
                        type="url"
                        placeholder="https://chat.whatsapp.com/..."
                        defaultValue={data.data.wp ?? ""}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end bg-muted/40 px-6 py-4 border-t">
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="text-destructive">
              <Building2 className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold">Failed to Fetch Academy Data</h2>
            <p className="text-muted-foreground">
              There was an error loading your academy information. Please try
              again later.
            </p>
            <Button asChild variant="outline">
              <Link href="/teacher/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }
};

export default Page;
