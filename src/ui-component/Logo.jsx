// material-ui
import { useTheme } from '@mui/material/styles';

// project imports

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function Logo() {
    const theme = useTheme();

    return (
        /**
         * if you want to use image instead of svg uncomment following, and comment out <svg> element.
         *
         * <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Full Connect" width="200" />
         *
         */
        <svg width="40%" height="100%" viewBox="0 0 180 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{maxWidth: '300px', height: 'auto', display: 'block', margin: '0 auto'}}>
            {/* Círculo dividido em 4 partes */}
            <g transform="translate(40, 40)">
                {/* Quadrante superior esquerdo - Azul */}
                <path
                    d="M0 0 L0 -25 A25 25 0 0 1 25 0 Z"
                    fill="#2196F3"
                />

                {/* Quadrante superior direito - Verde */}
                <path
                    d="M0 0 L25 0 A25 25 0 0 1 0 25 Z"
                    fill="#4CAF50"
                />

                {/* Quadrante inferior direito - Laranja */}
                <path
                    d="M0 0 L0 25 A25 25 0 0 1 -25 0 Z"
                    fill="#FF9800"
                />

                {/* Quadrante inferior esquerdo - Roxo */}
                <path
                    d="M0 0 L-25 0 A25 25 0 0 1 0 -25 Z"
                    fill="#9C27B0"
                />

                {/* Círculo interno branco para criar separação */}
                <circle cx="0" cy="0" r="12" fill="white" />
            </g>

            {/* Texto "Full Connect" ao lado */}
            <text x="85" y="35" fontSize="20" fontWeight="700" fill={theme.palette.text.primary} fontFamily="Arial, sans-serif">
                Full
            </text>
            <text x="85" y="55" fontSize="20" fontWeight="700" fill={theme.palette.text.primary} fontFamily="Arial, sans-serif">
                Connect
            </text>
        </svg>
    );
}