import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import ProfileForm from "./components/ProfileForm";

const ProfileContent = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <ProfileForm
      email={currentUser.email}
      firstName={currentUser.firstName}
      lastName={currentUser.lastName}
    />
  );
};

const ProfilePage = () => {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="mt-6">
        <Suspense fallback={<p>Loading profile...</p>}>
          <ProfileContent />
        </Suspense>
      </div>
    </main>
  );
};

export default ProfilePage;
