import { AppBar, Toolbar } from '@mui/material'
import Logo from './shared/Logo'
import { useAuth } from '../context/AuthContext'
import NavigationLink from './shared/NavigationLInk'

const Header = () => {
    const auth = useAuth();

  return (
    
    //AppBar is just like the basic nav tag with predefined styles
    <AppBar sx={{ bgcolor: "transparent", position: "static", boxShadow: "none" }}> 
        <Toolbar sx={{ display: "flex" }}>
            <Logo/>
            <div>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink
                bg="#00fffc"
                to="/chat"
                text="Go To Chat"
                textColor="black"
              />
              <NavigationLink
                bg="#51538f"
                textColor="white"
                to="/"
                text="logout"
                onClick={auth.logout}
              />
            </>
          ) : (
            <>
              <NavigationLink
                bg="#00fffc"
                to="/login"
                text="Login"
                textColor="black"
              />
              <NavigationLink
                bg="#51538f"
                textColor="white"
                to="/signup"
                text="Signup"
              />
            </>
          )}
        </div>
        </Toolbar>
    </AppBar>
  )
}

export default Header
