export default function Loader ({ show }) {
    return show ?   <div className="spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>: null;
}