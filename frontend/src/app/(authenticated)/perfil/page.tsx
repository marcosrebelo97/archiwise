import AccountSettings from '@views/account-settings'
import Account from '@views/account-settings/account'
import Security from '@views/account-settings/security'

export default function PerfilPage() {
  return (
    <AccountSettings
      tabContentList={{
        account: <Account />,
        security: <Security />
      }}
    />
  )
}
