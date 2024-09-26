function Slip2() {
    return (
        <section className="payment-receipt-main">
            <div class="container slip-padding">

                <header class="header ">
                    <div class="company-info">
                        <h2>Application For Payment</h2>
                        <h3>Struct Steel Engineering Ltd.</h3>
                        <p>38 Farnamullan Road, Faughard, Enniskillen, United Kingdom</p>
                        <p>Phone: +44 28 6638 7001</p>
                        <p>structsteeleng.co.uk</p>
                    </div>
                    <div className="company-logo">
                        <img src="structsteel.jpg" alt="structsteel" />
                    </div>
                    
                </header>
                <hr className="line_black" />

                <div class="project-info-main">
                    <div className="client-info">
                        <hr className="red_line" />
                        <span>Client</span>
                        <hr className="red_line" />
                        <div className="client-data">
                            <p>D Gibson Building & Joinery Contractor</p>
                            <p>27 Slievenaboley Road</p>
                            <p>Dromara</p>
                            <p>BT25 2EN</p>
                        </div>
                        <hr className="line_black" />
                    </div>

                    <div className="project-info">
                        <hr className="line_black" />
                        <div className="project-info-row">
                            <p>Project:</p>
                            <span>Radius Plastics</span>
                        </div>
                        <hr className="line_dummy" />
                        <div className="project-info-row">
                            <p>Application Number:</p>
                            <span>004</span>
                        </div>
                        <hr className="line_dummy" />
                        <div className="project-info-row">
                            <p>For Works Complete to:</p>
                            <span>31 August 2024</span>
                        </div>
                        <hr className="line_dummy" />
                        <div className="project-info-row">
                            <p>Application Date:</p>
                            <span>31 August 2024</span>
                        </div>
                        <hr className="line_dummy" />
                        <div className="project-info-row">
                            <p>Payment Date:</p>
                            <span>14 September 2024</span>
                        </div>
                        <hr className="line_black" />

                    </div>
                </div>


                <section class="progress-summary">

                    <table>
                        <thead>
                            <tr>
                                <th>Ref</th>
                                <th>Category</th>
                                <th>Zone</th>
                                <th>Account Total</th>
                                <th>% Progress</th>
                                <th>Interim Payment</th>
                                <th>Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Steelwork</td>
                                <td></td>
                                <td>£ 254,375.43</td>
                                <td>100%</td>
                                <td>£ 254,375.43</td>
                                <td>See BoQ Summary Tab for breakdown</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>HD Bolts Supply</td>
                                <td></td>
                                <td>£ 1,470.00</td>
                                <td>100%</td>
                                <td>£ 1,470.00</td>
                                <td>See BoQ Summary Tab for breakdown</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Cold Rolled</td>
                                <td></td>
                                <td>£ 61,846.60</td>
                                <td>100%</td>
                                <td>£ 61,846.60</td>
                                <td>See BoQ Summary Tab for breakdown</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>Cladding</td>
                                <td></td>
                                <td>£ 305,434.09</td>
                                <td>94%</td>
                                <td>£ 288,347.27</td>
                                <td>See BoQ Summary Tab for breakdown</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>Discount</td>
                                <td></td>
                                <td>-£ 3,126.12</td>
                                <td>97%</td>
                                <td>-£ 3,040.40</td>
                                <td>See BoQ Summary Tab for breakdown</td>
                            </tr>
                            <tr>
                                <td>6</td>
                                <td>Intumescent</td>
                                <td></td>
                                <td>£ 93,553.00</td>
                                <td>95%</td>
                                <td>£ 88,875.35</td>
                                <td>Adjustment made under VO1</td>
                            </tr>
                            <tr>
                                <td>7</td>
                                <td>Variation Register</td>
                                <td></td>
                                <td>-£ 57,600.00</td>
                                <td>100%</td>
                                <td>-£ 57,600.00</td>
                                <td>See "Variation Register" Tab</td>
                            </tr>
                          
                        </tbody>
                    </table>

                    <hr className="red_line" />
                <tbody>
                    <tr>
                        <td>Account Total : </td>
                        <td>€ 1,511,547.68</td>

                        <td>Progress Total:</td>
                        <td>€ 1,165,206.41</td>
                    </tr>
                </tbody>
                <hr className="red_line" />

                </section>

                <div className="over-all-main">
                <hr className="line_black" />
                <div className="project-row">
                    <p>OVERALL PROGRESS</p>
                    <span>97%</span>
                </div>
                <hr className="line_dummy" />
                <div className="project-row">
                    <p>PROGRESS TOTAL</p>
                    <span>€</span>
                    <span>634,274.25</span>
                </div>
                <hr className="line_dummy" />
                <div className="project-row">
                    <p>RETENTION 0%</p>
                    <span>€</span>
                    <span>31,713.71</span>
                </div>
                <hr className="line_dummy" />
                <div className="project-row">
                    <p>NETT CERTIFIED TO DATE</p>
                    <span>-€</span>
                    <span>570,664.47</span>
                </div>
            
                <div className="project-dub-heading color">
                    <span>NETT PAYMENT DUE</span>
                    <span>€</span>
                    <span>31,896.07</span>
                </div>
            </div>

            <div className="logo-combination">
                <img src="footerlogos.jpg" alt="..."/>
            </div>

            </div>
        </section>
    )
}
export default Slip2;