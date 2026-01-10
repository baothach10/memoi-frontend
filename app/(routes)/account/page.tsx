import { getUserProfile } from "@/app/api/getUserProfile";


async function AccountPage() {
  const userData = await getUserProfile();
  return (
    <div>AccountPage
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  )
}

export default AccountPage