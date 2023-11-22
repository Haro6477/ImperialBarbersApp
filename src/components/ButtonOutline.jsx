export function ButtonOutline({ children = "No", icon = "", disabled=false }) {
    return (
        <button disabled={disabled} className="btn btn-outline-secondary rounded-pill mb-2" type="button">
            {icon && <i className={icon + " me-2"}></i>}
            {children}
        </button>
    )
}