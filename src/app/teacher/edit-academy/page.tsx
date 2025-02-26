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

    console.log(data);

    return (
      <div className="space-y-4 p-4">
        <div>
          <h1 className="text-2xl font-bold">Edit Academy Details</h1>
        </div>

        <form
          className="grid grid-cols-2 gap-4"
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
          <div className="space-y-2">
            <Label htmlFor="academy_name">Academy Name</Label>
            <Input
              id="academy_name"
              name="academy_name"
              type="text"
              defaultValue={data.data.academy_name}
              required
            />

            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              name="display_name"
              type="text"
              defaultValue={data.data.display_name}
              required
            />

            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={data.data.contact_email}
              required
            />

            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input
              id="contact_phone"
              name="contact_phone"
              type="tel"
              defaultValue={data.data.contact_phone}
              required
            />

            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              name="about"
              defaultValue={data.data.about ?? ""}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              defaultValue={data.data.website ?? ""}
              required
            />

            <Label htmlFor="yt">YouTube Channel</Label>
            <Input
              id="yt"
              name="yt"
              type="url"
              defaultValue={data.data.yt ?? ""}
              required
            />

            <Label htmlFor="fb">Facebook Page</Label>
            <Input
              id="fb"
              name="fb"
              type="url"
              defaultValue={data.data.fb ?? ""}
              required
            />

            <Label htmlFor="ig">Instagram Page</Label>
            <Input
              id="ig"
              name="ig"
              type="url"
              defaultValue={data?.data?.ig ?? ""}
              required
            />

            <Label htmlFor="tw">Twitter Page</Label>
            <Input
              id="tw"
              name="tw"
              type="url"
              defaultValue={data.data.tw ?? ""}
              required
            />

            <Label htmlFor="tg">Telegram Channel</Label>
            <Input
              id="tg"
              name="tg"
              type="url"
              defaultValue={data.data.tg ?? ""}
              required
            />

            <Label htmlFor="wp">WhatsApp Group</Label>
            <Input
              id="wp"
              name="wp"
              type="url"
              defaultValue={data.data.wp ?? ""}
              required
            />

            <Button type="submit" className="float-right">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    );
  } catch (error) {
    return <div>Failed to fetch Profile Data</div>;
  }
};

export default Page;
