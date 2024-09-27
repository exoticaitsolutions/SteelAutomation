function Slip() {
    return (
        <section className="payment-receipt-main">
            <div className="container slip-padding">
                <div className="first-main-div  flex space-between">
                    <div className="heading-box">
                        <div className="application">
                            <h2>Application For Payment</h2>
                        </div>
                        <div className="cavan-text">
                            <span>Cavan Roofing & Engineering</span>
                            <p>Knockaterry, Cloverhill,
                                 Co. Cavan 047 55189 / 047 55000
                                Cavanroofing.Ie</p>
                        </div>

                    </div>
                    <div className="logo-main">
                        <img src="cre.jpg" alt="----" />
                    </div>

                </div>
                <hr className="line" />

                <div className="second-main-div  ">
                    <div className="client-main">
                        <div className="client-heading">
                            <span>Client</span>
                        </div>
                        <div className="address">
                            <p>Elliott Construction
                                Elliott Group, Station House, Cavan,
                                Co. Cavan, Ireland, H12 DA52</p>
                        </div>
                        <hr className="line" />
                    </div>

                    <div className="project-DUB-main">
                        <div className="project-dub-heading">
                            <span>Project</span>
                            <span>DUB 010</span>
                        </div>
                        <div className="project-row">
                            <p>Application Number:</p>
                            <span>002</span>
                        </div>
                        <hr className="line" />
                        <div className="project-row">
                            <p>For Works Complete to:</p>
                            <span>31 August 2024</span>
                        </div>
                        <hr className="line" />
                        <div className="project-row">
                            <p>Application Date:</p>
                            <span>22 August 2024</span>
                        </div>
                        <hr className="line" />
                        <div className="project-row">
                            <p>Payment Date:</p>
                            <span>30 September 2024</span>
                        </div>
                        <hr className="line" />

                    </div>
                </div>

                <table class="fixed_headers">
                    <thead>
                        <tr>
                            <th>Ref</th>
                            <th>Description</th>
                            <th>Zone</th>
                            <th>Account Total</th>
                            <th>% Complete</th>
                            <th>Interm Payment</th>
                            <th>Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Sub Contract Works</td>
                            <td>-----</td>
                            <td>€ 1,213,322.92</td>
                            <td>75%</td>
                            <td>€ 907,425.01</td>
                            <td>See "Progress summary" tab for breakdown</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Sub Contract Works</td>
                            <td>-----</td>
                            <td>€ 1,213,322.92</td>
                            <td>75%</td>
                            <td>€ 907,425.01</td>
                            <td>See "Progress summary" tab for breakdown</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Sub Contract Works</td>
                            <td>-----</td>
                            <td>€ 1,213,322.92</td>
                            <td>75%</td>
                            <td>€ 907,425.01</td>
                            <td>See "Progress summary" tab for breakdown</td>
                        </tr>

                    </tbody>

                </table>
                <hr className="line" />
                <tbody>
                    <tr>
                        <td>Account Total : </td>
                        <td>€ 1,511,547.68</td>

                        <td>Progress Total:</td>
                        <td>€ 1,165,206.41</td>
                    </tr>
                </tbody>
                <hr className="line" />
            

            <div className="over-all-main">
                <hr className="line" />
                <div className="project-row">
                    <p>OVERALL PROGRESS</p>
                    <span>77%</span>
                </div>
                <hr className="line" />
                <div className="project-row">
                    <p>PROGRESS TOTAL</p>
                    <span>€</span>
                    <span>1,165,206.41</span>
                </div>
                <hr className="line" />
                <div className="project-row">
                    <p>RETENTION 0%</p>
                    <span>€</span>
                    <span></span>
                </div>
                <hr className="line" />
                <div className="project-row">
                    <p>NETT CERTIFIED TO DATE</p>
                    <span>-€</span>
                    <span>400,000.00</span>
                </div>
                <hr className="line" />
                <div className="project-dub-heading">
                    <span>NETT PAYMENT DUE</span>
                    <span>€</span>
                    <span>765,206.41</span>
                </div>
            </div>

            </div>
        </section>
    )
}
export default Slip;