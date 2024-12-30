
import "./SpecialOffer.css";


interface Props
{
    headline: string;
    cost: string;
    validUntil: string;
    showButton: boolean;
}

const SpecialOffer = ({ headline, cost, validUntil, showButton }: Props) =>
{
    return (
        <>
            <div className="special-offer-wrapper">
                <img src="/assets/gift.png" height={80} alt="Gift Icon" className="special-offer-image" />
                <div className="special-offer-body">
                    <span className="special-offer-headline">{headline}</span>
                    <span className="special-offer-text">Pomelo has a special offer to lock in {cost} for life!</span>
                    <span className="special-offer-subtext">Offer ends {validUntil}. New members only.</span>
                    { showButton && <>
                        <a className="special-offer-button" href="/register">
                            Sign Up!
                        </a>
                    </> }
                </div>
                
            </div>
        </>
    );
};

export default SpecialOffer;