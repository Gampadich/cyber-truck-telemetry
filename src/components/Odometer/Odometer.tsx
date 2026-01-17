import "./Odometer.css"

interface Props{
    value : number
}

const Digit = ({value, isLast} : {value : number, isLast?: boolean}) => {
    return (
        <div className={`odometer-window ${isLast ? 'last-digit' : ''}`}>
            <div
                className="odometer-strip"
                style={{ transform : `translateY(-${value * 10}%)`}}
            >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <div key={num} className="odometer-num">
                        {num}
                    </div>
                ))}
            </div>
            <div className="odometer-overlay"></div>
        </div>
    )
}

export const Odometer : React.FC<Props> = ({value}) => {
    const formattedValue = Math.floor(value * 10).toString().padStart(6, '0')
    const digits = formattedValue.split('').map(Number)

    return (
        <div className="odometer-container">
            <div className="odometer-label">TOTAL KM</div>
            <div className="odometer-display">
                {digits.map((digit, index) => (
                    <Digit
                        key={index}
                        value={digit}
                        isLast={index === digits.length - 1}
                    />
                ))}
            </div>
        </div>
    )
}