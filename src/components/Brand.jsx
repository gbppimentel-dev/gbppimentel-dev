import { asset } from '../utils/assets';

// One shared logo lockup keeps the header and footer in sync.
export default function Brand({ className = '' }) {
  return <a href="#home" className={`brand-link ${className}`} aria-label="gbppimentel-dev — home">
    <img className="brand-mark" src={asset('brand/mark-512.png')} width="44" height="44" alt="" />
    <span className="brand-wordmark">gbppimentel<span className="brand-dev">-dev</span></span>
  </a>;
}
