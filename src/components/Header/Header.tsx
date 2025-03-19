import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    // Evita que eventos de teclado indesejados fechem o drawer
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <header className="p-4 relative">
      <nav className="container w-full mx-auto flex items-center justify-evenly">
        {/* Versão desktop */}
        <div className="hidden w-8/12 md:flex gap-12 items-center justify-between">
          <a href="#home" className="text-white hover:text-gray-300">
            Home
          </a>
          <a href="#services" className="text-white hover:text-gray-300">
            Serviços
          </a>
          <div className="flex items-center">
            <svg
              className="w-32" // tamanho reduzido para mobile
              viewBox="0 0 368 138"
              preserveAspectRatio="xMidYMid meet"
              fill="white"
              stroke="white"
            >
              <g transform="translate(0,138) scale(0.1,-0.1)">
                {/* Conteúdo do SVG da logo */}
                <path d="M117 1224 c-4 -4 -7 -167 -7 -361 l0 -354 408 3 407 3 45 25 c69 39 91 86 88 184 l-3 79 -43 38 c-42 36 -42 38 -22 49 37 20 60 70 60 133 0 95 -33 147 -115 184 -36 16 -80 18 -425 21 -212 2 -389 0 -393 -4z m739 -178 c8 -11 14 -29 14 -41 0 -12 -6 -30 -14 -41 -14 -18 -31 -19 -285 -22 l-271 -3 0 66 0 66 271 -3 c254 -3 271 -4 285 -22z m-2 -267 c30 -24 34 -63 9 -91 -15 -17 -37 -18 -290 -18 l-273 0 0 65 0 65 264 0 c251 0 265 -1 290 -21z" />
                <path d="M1240 1145 l0 -87 419 3 c398 3 421 2 440 -15 16 -14 21 -31 21 -66 0 -84 21 -80 -448 -80 l-412 0 0 -195 0 -195 100 0 100 0 0 110 0 110 196 0 196 0 121 -110 121 -110 126 0 125 0 -55 53 c-30 29 -85 80 -122 113 -38 34 -68 64 -68 68 0 3 15 6 33 6 40 0 105 30 134 61 34 37 43 73 43 169 0 105 -17 158 -63 193 -68 51 -72 51 -554 55 l-453 3 0 -86z" />
                <path d="M2480 1226 c0 -2 78 -72 173 -157 94 -84 182 -162 194 -173 l22 -21 -199 -175 c-109 -96 -199 -178 -199 -182 -1 -5 52 -8 117 -8 l117 1 110 100 c61 55 129 116 152 135 l42 36 148 -136 148 -136 125 0 c68 0 120 4 115 8 -6 5 -97 86 -203 182 -180 161 -192 173 -177 190 9 9 94 87 190 171 96 85 175 157 175 161 0 5 -52 8 -116 8 l-115 0 -147 -130 -147 -130 -35 34 c-19 18 -84 76 -144 130 l-109 96 -119 0 c-65 0 -118 -2 -118 -4z" />
                <path d="M1470 230 l0 -60 50 0 c38 0 50 4 50 15 0 11 -11 15 -40 15 l-40 0 0 45 c0 25 -4 45 -10 45 -6 0 -10 -27 -10 -60z" />
                <path d="M1756 242 c-31 -61 -34 -82 -8 -59 24 22 61 22 78 0 7 -10 16 -15 20 -11 9 10 -11 56 -40 93 l-24 29 -26 -52z m44 -13 c0 -5 -4 -9 -10 -9 -5 0 -10 7 -10 16 0 8 5 12 10 9 6 -3 10 -10 10 -16z" />
                <path d="M2028 268 c-2 -13 -1 -40 1 -60 3 -37 5 -38 41 -38 47 0 62 17 56 65 -6 44 -18 55 -63 55 -25 0 -32 -5 -35 -22z m63 -13 c0 -13 -41 -19 -41 -7 0 11 20 22 33 18 5 -1 8 -6 8 -11z m7 -46 c-2 -6 -7 -10 -11 -10 -4 1 -14 1 -22 1 -8 0 -15 5 -15 10 0 6 12 10 26 10 14 0 24 -5 22 -11z" />
                <path d="M2260 275 c-19 -22 -2 -48 36 -55 39 -7 30 -26 -11 -22 -40 3 -47 -14 -11 -24 33 -8 57 -2 69 17 16 26 1 49 -33 49 -16 0 -30 5 -30 10 0 6 14 10 31 10 40 0 34 24 -8 28 -18 2 -35 -3 -43 -13z" />
              </g>
            </svg>
          </div>
          <a href="#metodologia" className="text-white hover:text-gray-300">
            Metodologia
          </a>
          <a href="#contact" className="text-white hover:text-gray-300">
            Contato
          </a>
        </div>

        {/* Versão mobile: Logo e botão do menu */}
        <div className="md:hidden flex items-center justify-between w-full">
          {/* Exibe a logo */}
          <div className="flex items-center">
            <svg
              className="w-32" // tamanho reduzido para mobile
              viewBox="0 0 368 138"
              preserveAspectRatio="xMidYMid meet"
              fill="white"
              stroke="white"
            >
              <g transform="translate(0,138) scale(0.1,-0.1)">
                {/* Conteúdo do SVG da logo */}
                <path d="M117 1224 c-4 -4 -7 -167 -7 -361 l0 -354 408 3 407 3 45 25 c69 39 91 86 88 184 l-3 79 -43 38 c-42 36 -42 38 -22 49 37 20 60 70 60 133 0 95 -33 147 -115 184 -36 16 -80 18 -425 21 -212 2 -389 0 -393 -4z m739 -178 c8 -11 14 -29 14 -41 0 -12 -6 -30 -14 -41 -14 -18 -31 -19 -285 -22 l-271 -3 0 66 0 66 271 -3 c254 -3 271 -4 285 -22z m-2 -267 c30 -24 34 -63 9 -91 -15 -17 -37 -18 -290 -18 l-273 0 0 65 0 65 264 0 c251 0 265 -1 290 -21z" />
                <path d="M1240 1145 l0 -87 419 3 c398 3 421 2 440 -15 16 -14 21 -31 21 -66 0 -84 21 -80 -448 -80 l-412 0 0 -195 0 -195 100 0 100 0 0 110 0 110 196 0 196 0 121 -110 121 -110 126 0 125 0 -55 53 c-30 29 -85 80 -122 113 -38 34 -68 64 -68 68 0 3 15 6 33 6 40 0 105 30 134 61 34 37 43 73 43 169 0 105 -17 158 -63 193 -68 51 -72 51 -554 55 l-453 3 0 -86z" />
                <path d="M2480 1226 c0 -2 78 -72 173 -157 94 -84 182 -162 194 -173 l22 -21 -199 -175 c-109 -96 -199 -178 -199 -182 -1 -5 52 -8 117 -8 l117 1 110 100 c61 55 129 116 152 135 l42 36 148 -136 148 -136 125 0 c68 0 120 4 115 8 -6 5 -97 86 -203 182 -180 161 -192 173 -177 190 9 9 94 87 190 171 96 85 175 157 175 161 0 5 -52 8 -116 8 l-115 0 -147 -130 -147 -130 -35 34 c-19 18 -84 76 -144 130 l-109 96 -119 0 c-65 0 -118 -2 -118 -4z" />
                <path d="M1470 230 l0 -60 50 0 c38 0 50 4 50 15 0 11 -11 15 -40 15 l-40 0 0 45 c0 25 -4 45 -10 45 -6 0 -10 -27 -10 -60z" />
                <path d="M1756 242 c-31 -61 -34 -82 -8 -59 24 22 61 22 78 0 7 -10 16 -15 20 -11 9 10 -11 56 -40 93 l-24 29 -26 -52z m44 -13 c0 -5 -4 -9 -10 -9 -5 0 -10 7 -10 16 0 8 5 12 10 9 6 -3 10 -10 10 -16z" />
                <path d="M2028 268 c-2 -13 -1 -40 1 -60 3 -37 5 -38 41 -38 47 0 62 17 56 65 -6 44 -18 55 -63 55 -25 0 -32 -5 -35 -22z m63 -13 c0 -13 -41 -19 -41 -7 0 11 20 22 33 18 5 -1 8 -6 8 -11z m7 -46 c-2 -6 -7 -10 -11 -10 -4 1 -14 1 -22 1 -8 0 -15 5 -15 10 0 6 12 10 26 10 14 0 24 -5 22 -11z" />
                <path d="M2260 275 c-19 -22 -2 -48 36 -55 39 -7 30 -26 -11 -22 -40 3 -47 -14 -11 -24 33 -8 57 -2 69 17 16 26 1 49 -33 49 -16 0 -30 5 -30 10 0 6 14 10 31 10 40 0 34 24 -8 28 -18 2 -35 -3 -43 -13z" />
              </g>
            </svg>
          </div>

          {/* Botão do menu (sempre à direita) */}
          <div>
            <button
              onClick={toggleDrawer(true)}
              className="relative z-30 text-white focus:outline-none"
            >
              {drawerOpen ? <div></div> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer do Material UI ancorado à direita */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#131313",
            color: "#fff",
            height: "100%",
            borderRadius: "0 0 0 6px",
          },
        }}
      >
        <div className="w-54 pl-6">
          <div className="pt-10 pr-10 flex justify-end">
            <button onClick={toggleDrawer(false)} className="text-white focus:outline-none">
              <X size={28} />
            </button>
          </div>
          <List>
            <ListItem disablePadding>
              <ListItemButton component="a" href="#home" onClick={toggleDrawer(false)}>
                <ListItemText
                  primary="Home"
                  primaryTypographyProps={{
                    style: { fontFamily: "Satoshi, sans-serif", fontSize: "20px" },
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="#services" onClick={toggleDrawer(false)}>
                <ListItemText
                  primary="Serviços"
                  primaryTypographyProps={{
                    style: { fontFamily: "Satoshi, sans-serif", fontSize: "20px" },
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="#metodologia" onClick={toggleDrawer(false)}>
                <ListItemText
                  primary="Metodologia"
                  primaryTypographyProps={{
                    style: { fontFamily: "Satoshi, sans-serif", fontSize: "20px" },
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="#contact" onClick={toggleDrawer(false)}>
                <ListItemText
                  primary="Contato"
                  primaryTypographyProps={{
                    style: { fontFamily: "Satoshi, sans-serif", fontSize: "20px" },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
