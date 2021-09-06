import Link from 'next/link';
import {css} from '@emotion/css';
import {useSelector} from 'react-redux';
import {StateKraKra} from '../redux/crypto';
import {getTotal} from '../redux/selectors';

const cssNavHeader = css`
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    align-content: center;
    align-items: baseline;
    gap: 10px;
`;

const cssNavItem = css`
    font-size: 20px;
    list-style: none;
`;


export const Header = () => {
    const total = useSelector(getTotal);
    return <header className={cssNavHeader}>
        <nav className={cssNavHeader}>
            <li className={cssNavItem}><Link href="/"><a>Wallet</a></Link></li>
            <li className={cssNavItem}><Link href="/historic"><a>Historic</a></Link></li>
        </nav>
        <p>total {total}</p>
    </header>;
}
