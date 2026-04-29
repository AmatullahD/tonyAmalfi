"use client"

import { useEffect, useState } from "react"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"

export default function TermsPage() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 w-full px-4 py-10 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">

          <Card className="p-5 sm:p-6 md:p-10 rounded-2xl shadow-sm">

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
              Terms of Service
            </h1>

            <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none leading-relaxed space-y-5 text-center">
              <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
              <p>
                Terms & conditions
                PLEASE READ THESE TERMS OF USE CAREFULLY. BY SIGNING UP TO AND/OR USING THIS PLATFORM AND OUR SERVICES, YOU AGREE TO BE BOUND BY ALL OF THE BELOW TERMS AND CONDITIONS AND PRIVACY POLICY.
              </p>
              <p>
                The website at www.tonyamalfi.com (“Website”) is owned and operated by Tony Amalfi  (“Tony Amalfi”, “we”, “us”, “our” and their respective connotations). The Website is collectively referred to as “Platform”.
                These terms of service (“Terms” / “Terms of Use”) describe the terms on which Tony Amalfi grants users of the Platform (“users”, “you”, “your” and their respective connotations) access to the Platform, and should be read with the privacy policy available here https://www.tonyamalfi.com/privacy-policy (“Privacy Policy”).
              </p>
              <p>
                Tony Amalfi enables the world's artists to earn money from their artwork by making it immediately and easily available for sale as a variety of products - without giving up control of their rights. We understand the importance of representing one's work with quality and respect, and we also believe it is essential that all Tony Amalfi users respect copyright. Whether you’re an artist, a customer, or just casually browsing the Website, please respect the copyright of all the works you see or buy on Tony Amalfi.
              </p>
              <p>
                Tony Amalfi offers the Platform and the Services conditioned upon the user’s acceptance of all terms, conditions, policies, and notices stated here. By procuring Services (defined below) from Tony Amalfi, or by use of Platform, the user agrees to be bound by these Terms, as applicable, to the use of the Platform and the Services provided by Tony Amalfi.
              </p>
              <p>
                By using the Services on the www.tonyamalfi.com, you are agreeing to the Terms of Use including those available by hyperlink, with Tony Amalfi, which may be updated by us from time to time. Please check this page regularly to take notice of any changes we may have made to the Terms of Use. Following the posting of any changes, the user’s continued use of or access to the Platform or Services from Tony Amalfi, constitutes acceptance of such revised Terms of Use.
              </p>
              <p>
                We reserve the right to review and withdraw or amend the Services without notice. If you do not agree with its terms, kindly do not use this Website.
              </p>
              <p>
                The Company may, after reasonable assessment, restrict customer accounts exhibiting unusually high return rates, repeated delivery failures, or other usage patterns that materially impact operational efficiency.
                The Company may, after reasonable assessment, levy a reasonable return processing fee on accounts exhibiting unusually high return activity, subject to prior disclosure at the time of return initiation.
              </p>


              <h2 className="text-2xl font-bold">2. ABOUT OUR SERVICES</h2>
              <p>
                Tony Amalfi provides a range of Services through the Platform, including but not limited to, enabling you to publish, sell, comment on, promote, and purchase merchandise art related products like clothing, footwear and accessories of various fashion and lifestyle; interact with other members; and receive the benefits of Tony Amalfi's product production service including payment processing, transaction handling, product manufacturing, packaging, order fulfilment, and customer service (“Services”).
              </p>

              <h2 className="text-2xl font-bold">3. HOW TO AVAIL AND USE THE SERVICES? </h2>
              <p>
                Services. We grant to you a personal, limited, revocable, non-exclusive and non-transferable license to access the Platform and use the Services only as expressly permitted in these Terms. You shall not access the Platform and/or use the Services for any illegal purpose or in any manner inconsistent with these Terms.
              </p>
              <p>
                Tony Amalfi reserves the right to suspend or disallow any user’s access to the Platform, or discontinue the Services, for any reason whatsoever, at any time without notice, and without incurring any liability thereof.
              </p>
              <p>
                You may be required to install certain upgrades or updates to the Platform in use, in order to continue to access the Platform and/or use the Services, or portions thereof (including upgrades or updates designed to correct issues with the Services). Any updates or upgrades provided to you by us under the Terms shall be considered part of the Services.
              </p>
              <p>
                Account. You must create an account and register yourself as a user in order to use the Services offered on the Platform. We will require your personal information, including but not limited to your name, date of birth, address, email ID, phone number, location, and card details. The use of all such personal information you provide to us (including during the registration process) is governed by our Privacy Policy.
              </p>
              <p>
                The user agrees that the user shall be bound by these Terms by accessing the Platform, or by otherwise accessing the Services provided by Tony Amalfi. If the user does not accept these Terms, the user shall not open an account for availing of the Services or using the Platform.
              </p>
              <p>
                Account Security. You shall be solely responsible for the confidentiality, safety and security of the user account opened by you. You must keep your password confidential and you are solely responsible for maintaining the confidentiality and security of your account, all changes and updates submitted through your account, and all activities that occur in connection with your account. In case the password is lost/stolen/misplaced/hacked/no longer in your control, you shall promptly inform us. We will upon receipt of such information block the relevant account.
              </p>
              <p>
                By creating an account, you represent to us that all information provided to us by you is true, accurate and correct, and that you will update your information as and when necessary, in order to keep it accurate.
              </p>
              <p>
                You agree that you shall not:
              </p>

              <ol className="list-[lower-alpha] list-inside space-y-2 inline-block text-left">
                <li>impersonate someone else, create or use an account for anyone other than yourself,</li>
                <li>provide an email address other than your own,</li>
                <li>create multiple accounts, or</li>
                <li>provide or use false or misleading information.</li>
              </ol>
              <p>
                You are also responsible for all activities that occur in your account. You agree to notify us immediately of any unauthorized use of your account in order to enable us to take necessary corrective action. You also agree that you will not allow any third party to use your account for any purpose and that you will be liable for such unauthorized access.
              </p>
              <p>
                By creating an account, you agree to receive certain communications in connection with the Platform and/or Services.
              </p>

              <h2 className="text-2xl font-bold"> 4. PRODUCT SERVICES AND INFORMATION </h2>
              <p>
                Tony Amalfi attempts to be as accurate as possible in the description of the product on the Platform. However, Tony Amalfi does not warrant that the product description, colour, information or other content of the Platform is accurate, complete, reliable, current or error-free. The Platform may contain typographical errors or inaccuracies and may not be complete or current. The product pictures are indicative and may not match the actual product.
              </p>
              <p>
                Tony Amalfi reserves the right to correct, change or update information, errors, inaccuracies or omissions at any time (including after an order has been submitted) without prior notice. Please note that such errors, inaccuracies or omissions may also relate to pricing and availability of the product or services.
              </p>

              <h2 className="text-2xl font-bold"> 5. CONTENT & COPYRIGHT POLICY </h2>
              <p>
                You understand that all information, images, pictures, data, text, music, sound, photographs, graphics, video, messages, or other materials (collectively, “Content”), whether publicly posted or privately transmitted, is the exclusive work and property of the person from whom such Content originated. Tony Amalfi does not claim any permanent ownership of your Content. You retain copyright and any other rights you already hold in Content which you submit, post, upload, display, or sell on or through Tony Amalfi. When you submit, post, upload, display, or sell Content, you grant Tony Amalfi a perpetual, irrevocable, worldwide, royalty-free, and non-exclusive (and sub-licensable) license to use and archive the Content in accordance with or as reasonably contemplated by this Agreement.
              </p>
              <p>
                Tony Amalfi cannot always manually screen Content before it is displayed on the Website, and occasionally members may inadvertently or deliberately submit and display content that breaches this Agreement. Inappropriate Content includes, but is not limited to, Content that
              </p>

              <ul className="list-disc list-inside space-y-1 inline-block text-left">
                <li>infringes the copyright, trademark, trade secret, or other intellectual property rights, rights of publicity, rights of privacy, or other contractual or proprietary rights of any person or company;</li>
                <li>defames or vilifies any person, people, races, religion or religious group;</li>
                <li>is inaccurate, illegal, defamatory, obscene, pornographic, vulgar, indecent, lewd, offensive, harassing, threatening, violent, harmful, invasive of privacy or publicity rights, abusive, inflammatory, insensitive, deceptive, false, misleading, fraudulent, or otherwise objectionable;</li>
                <li>promotes hatred, discrimination, bigotry, racism, harassment, violence, gambling or harm against any individual or group;</li>
                <li>violates, or encourages any conduct that would violate, any applicable laws, rules or regulations or give rise to any civil liability;</li>
                <li>contains any viruses, corrupted data or other harmful, disruptive or destructive files;</li>
                <li>restricts, interferes with or inhibits any other person from using or enjoying the Services;</li>
                <li>impersonates, or misrepresents your affiliation with, any person or entity;</li>
                <li>contains any unsolicited promotions, political campaigning, advertising or solicitations;</li>
                <li>contains all or any forms of misinformation or disinformation;</li>
                <li>threatens the unity, integrity, defence, security, or sovereignty of India, friendly relations with foreign nations, or public order, or causes incitement to the commission of any cognizable offense, or prevents investigation of an offense, or is insulting other nations;</li>
                <li>in our sole judgment, is objectionable, restricts or inhibits any other person from using or enjoying Services; or</li>
                <li>that would otherwise expose us or any third party to liability, special regulations, or harm of any kind.</li>
              </ul>
              <p>
                Tony Amalfi shall in no way be held responsible for examining or evaluating Content, nor does it assume any responsibility or liability for the Content. This means that you, and not Tony Amalfi, are entirely responsible for all Content that you upload for sale as products, post, email, transmit or otherwise make available via Tony Amalfi. Tony Amalfi does not control the Content posted via Tony Amalfi services and, as such, does not guarantee the accuracy, integrity or quality of such Content. You understand that by using Tony Amalfi’s services, you may be exposed to Content that is offensive, indecent or objectionable. Under no circumstances will Tony Amalfi be liable in any way for any Content, including, but not limited to, any errors or omissions in any Content, or any loss or damage of any kind incurred as a result of the use of any Content posted, emailed, transmitted or otherwise made available via Tony Amalfi.
              </p>
              <p>
                You understand that you will be exposed to Content from a variety of Tony Amalfi users and that Tony Amalfi is not responsible for the accuracy, usefulness, safety, or intellectual property rights of and/or relating to such Content. You further understand and acknowledge that you may be exposed to Content that is inaccurate, offensive, indecent, or objectionable, and you agree to waive, and hereby do waive, any legal or equitable rights or remedies you have or may have against Tony Amalfi with respect thereto, and agree to defend, indemnify and hold harmless Tony Amalfi, its parent corporation, its subsidiaries, its employees, its licensors, and their respective officers, directors, employees, and agents to the fullest extent allowed by law regarding all matters related to your use of Tony Amalfi service.
              </p>
              <p>
                While we try to offer reliable data, we cannot promise that the Content and postings on Website will always be accurate and up-to-date. You will be responsible for ensuring that your posts are accurate and do not include misleading information. You agree that you will not hold us responsible for inaccuracies in any postings on the Website.
              </p>
              <p>
                Tony Amalfi and its designees shall have the right (but not the obligation) in their sole discretion to pre-screen, refuse, or remove any Content that is available via the Website. Without limiting the foregoing, Tony Amalfi and its designees shall have the right to remove any Content that violates the Terms of Use or is otherwise objectionable. You agree that you must evaluate, and bear all risks associated with, the use of any Content, including any reliance on the accuracy, completeness, or usefulness of such Content. In this regard, you acknowledge that you may not rely on any Content created by Tony Amalfi or submitted to Tony Amalfi, including, without limitation, information about Tony Amalfi collaborations, posts, or in any other part of the Website.
              </p>
              <p>
                You acknowledge, consent and agree that Tony Amalfi may access, preserve, and disclose your account information and Content if required to do so by law or in good faith belief that such access, preservation, or disclosure is reasonably necessary to:
              </p>

              <ol className="list-[lower-roman] list-inside space-y-2 inline-block text-left">
                <li>comply with legal processes;</li>
                <li>enforce the Terms of Use;</li>
                <li>respond to claims that any Content violates the rights of third parties;</li>
                <li>respond to your requests for customer service; or</li>
                <li>protect the rights, property, or personal safety of Tony Amalfi, its users, and the public.</li>
              </ol>

              <p>
                By using services of Tony Amalfi, you agree to receiving promotional or information content relevant to Tony Amalfi through the medium of SMS or Email or both. Once you place an order with us, you automatically get subscribed to our order related Whatsapp notifications.
              </p>

              <p>
                Without limiting other remedies, we may limit, suspend, or terminate our service and user accounts, prohibit access to the Website, delay or remove hosted Content, and take technical and legal steps to keep users off the Website if we think that they are creating problems, possible legal liabilities, or acting inconsistently with the letter or spirit of our Terms herein.
              </p>

              <p>
                Tony Amalfi also reserves the right to cancel unconfirmed accounts or accounts that have been inactive for extended periods of time, without providing any prior notice, and at its sole discretion.
              </p>

              <h2 className="text-2xl font-bold"> 6. DISCLAIMER OF WARRANTY AND LIMITATION OF LIABILITY </h2>
              <p>
                This Platform and the Services are provided on an “as is” basis. Tony Amalfi, its licensors and affiliates make no representations or warranties of any kind (express, statutory or implied) as to the operation of the Platform, provision of Services, or the information, content, materials, included on the Platform, or in association with the Services or any third- party websites or services. Tony Amalfi will not be held responsible for any unethical, illegal acts performed by the users and the action of each of the users shall be their own responsibility solely. Further, Tony Amalfi will not be responsible for any harm, accident or injury arising out of the failure of the users to consult qualified health professionals and/or medical practitioners.
              </p>
              <p>
                TONY AMALFI DISCLAIMS ANY AND ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, QUALITY OF SERVICE, AND FITNESS FOR A PARTICULAR PURPOSE, AND SHALL NOT BE RESPONSIBLE FOR ANY LOSS OF DATA, LOSS OF PROFITS OR ANY KIND OF MISUSE (STATUTORY OR OTHERWISE) BY ANY OF ITS USERS, OR ANY OTHER INDIRECT DAMAGE OR CONSEQUENCE ARISING FROM OR IN RELATION TO THE USE OF THE SERVICES.
              </p>
              <p>
                The Platform may contain inaccuracies and typographical and clerical errors and may involve or make use of advanced language models including generative AI. Tony Amalfi expressly disclaims any obligation(s) to update this Platform or any of the materials available on this Platform. The Company does not warrant the accuracy or completeness of the materials or the reliability of any advice, opinion, statement or other information displayed or distributed through the Platform. You accept and agree that the content on this Platform is for informational purposes only and should not be construed as technical advice of any manner.
              </p>
              <p>
                Except as provided above, there are no other warranties, conditions, or other terms and conditions, express or implied, statutory or otherwise, and all such terms and conditions are hereby excluded to the maximum extent permitted by applicable law.
              </p>
              <p>
                YOU AGREE THAT, TO THE FULLEST EXTENT PERMITTED BY LAW, NEITHER WE NOR OUR SUBSIDIARIES, AFFILIATES, PARTNERS, OR LICENSORS WILL BE LIABLE FOR ANY INDIRECT, SPECIAL, PUNITIVE, INCIDENTAL, OR CONSEQUENTIAL DAMAGES OF ANY KIND (INCLUDING LOST PROFITS) RELATED TO THE SITE OR YOUR USE THEREOF REGARDLESS OF THE FORM OF ACTION WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND IN NO EVENT SHALL OUR MAXIMUM AGGREGATE LIABILITY EXCEED THE TOTAL AMOUNT PAID BY YOU IN RELATION TO THE SERVICES AND/OR PLATFORM.
              </p>
              <p>
                YOU AGREE THAT NO CLAIMS OR ACTION ARISING OUT OF, OR RELATED TO, THE USE OF THE SITE OR THESE TERMS AND CONDITIONS MAY BE BROUGHT BY YOU MORE THAN ONE (1) YEAR AFTER THE CAUSE OF ACTION RELATING TO SUCH CLAIM OR ACTION AROSE. IF YOU HAVE A DISPUTE WITH US OR ARE DISSATISFIED WITH THE SITE, TERMINATION OF YOUR USE OF THE SITE IS YOUR SOLE REMEDY. WE HAVE NO OTHER OBLIGATION, LIABILITY, OR RESPONSIBILITY TO YOU.
              </p>
              <p>
                You will not hold Tony Amalfi responsible for other users' Content, actions or inactions, or collaborations. We have no control over and do not guarantee the quality, safety, or legality of collaborations advertised, the truth or accuracy of users' Content, the ability of parties to deliver on collaborations, or that the parties will actually complete a transaction.
              </p>
              <p>
                You must take your own precautions to ensure that the process you employ for accessing Tony Amalfi's Service does not expose you to the risk of viruses, malicious computer code, or other forms of interference which may damage own computer system. We do not accept responsibility for any interference or damage to any computer system that arises in connection with your use of the Website or any linked website.
              </p>
              <p>
                We do not accept liability for any losses arising directly or indirectly from a failure to provide any service, corruption to or loss of data, errors or interruptions, any suspension or discontinuance of service, or any transmissions by others in contravention of the registered members' obligations as set out in these Terms of Use.
              </p>
              <p>
                You acknowledge that we may not be able to confirm the identity of other registered users or prevent them acting under false pretences or in a manner that infringes the rights of any person.
              </p>

              <h2 className="text-2xl font-bold"> 7. INTELLECTUAL PROPERTY RIGHTS </h2>
              <p>
                User acknowledges that it is obtaining the right to access the Platform and use the Services, and that irrespective of any use of the words “purchase”, “sale” or like terms, in no case will any ownership rights be conveyed or be deemed to be conveyed to the user under these terms. User agrees that Tony Amalfi or its suppliers retain all rights, title, and interest (including all intellectual property rights) in and to the Platform, Services, all documentation, services deliverables, and any and all related and underlying technology and documentation and any derivative works, modifications or improvements of any of the foregoing (including but not limited to all texts, graphics, photos, illustrations, questionnaire content, logos), including Feedback (collectively, “Company Technology”).
              </p>
              <p>
                You shall not copy, download, publish, distribute or reproduce any of the information contained on this Platform or social media in any form without the prior written consent of Tony Amalfi. Except as expressly set forth in these terms, no rights in any Company Technology are granted to the User.
              </p>
              <p>
                If you use any of our trademarks in reference to our products or services, you must include a statement attributing that trademark to us, and only after securing prior written permission from Tony Amalfi to do so, which may be given, or refused, at its sole discretion, and subject to any terms or conditions it may deem fit. You must not use any of our trademarks in or as the whole or part of your own trademarks; in connection with activities, products or Services which are not ours; in a manner which may be confusing, misleading or deceptive; or in a manner that disparages us or our information, products, and/or Services (including the Website or the App), or in a manner that implies any kind of any association/affiliation with Tony Amalfi.
              </p>

              <h2 className="text-2xl font-bold"> 8. CANCELLATION POLICY</h2>
              <p>
                Please refer to our Cancellation Policy provided on our Site.
              </p>

              <h2 className="text-2xl font-bold"> 9. REFUNDS AND RETURNS POLICY</h2>
              <p>
                Please refer to our Refunds and Returns Policy provided on our Site.
              </p>

              <h2 className="text-2xl font-bold"> 10. TERMINATION OF ACCOUNT</h2>
              <p>
                Tony Amalfi may terminate your access to all or any part of its Services at any time, with or without cause, with or without notice, effective immediately. You may terminate your use of the Services at any time. However, you shall continue to be bound by all provisions of these Terms of Use, which shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
              <p>
                Tony Amalfi will terminate your access to the site if you are determined to be, in Tony Amalfi's sole discretion, a repeat infringer of the Content & Copyright Policy and/or these Terms of Use.
                Tony Amalfi may, but shall not be obligated to, give you one warning if you have violated these Terms of Use prior to termination of your account.
              </p>
              <p>
                By accepting the terms and conditions, the user consents to pay Tony Amalfi the complete amount for the order placed by them from Tony Amalfi. However, Tony Amalfi does not control the amount charged to the user by their bank related to their purchase from Tony Amalfi, to which Tony Amalfi disclaims any liability in this regard.
              </p>

              <h2 className="text-2xl font-bold"> 11. INDEMNIFICATION</h2>
              <p>
                You hereby agree to indemnify and keep indemnified Tony Amalfi against all damages, liabilities, costs, expenses, claims, suits and proceedings (including reasonable attorney’s fee) that may be suffered by Tony Amalfi because of:
              </p>

              <ol className="list-[lower-roman] list-inside space-y-2 inline-block text-left">
                <li>violation of these Terms of Use by you;</li>
                <li>violation of applicable laws;</li>
                <li>wilful negligence or misconduct on your part in dealing with the Platform.</li>
              </ol>

              <h2 className="text-2xl font-bold"> 12. SEVERABILITY</h2>
              <p>
                If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
              </p>

              <h2 className="text-2xl font-bold"> 13. WAIVER</h2>
              <p>
                If Tony Amalfi does not exercise a right under these Terms of Use, such non-exercise shall not constitute a waiver of such right. Waiver of any right, remedy or breach of any subject matter contained in these Terms of Use shall not be viewed as a waiver by Tony Amalfi, unless specifically agreed by Tony Amalfi in writing.
              </p>

              <h2 className="text-2xl font-bold"> 14. FORCE MAJEURE</h2>
              <p>
                Tony Amalfi shall not be liable for any delay or failure of performance in respect of obligations under these Terms, caused by events beyond the reasonable control of Tony Amalfi, including but not limited to acts of God, wars, insurrections, riots, sabotage, passing or repealing of any law, ordinance, direction, or order by any governmental, statutory, regulatory, or judicial authority, and/or any such event.
              </p>

              <h2 className="text-2xl font-bold"> 15. ENTIRE AGREEMENT</h2>
              <p>
                These Terms read along with our Privacy Policy constitute the entire agreement between Tony Amalfi and You in relation to Your use of this Platform and supersede all prior agreements and understandings between the parties.
              </p>


              <h2 className="text-2xl font-bold"> 16. GOVERNING LAW & JURISDICTION</h2>
              <p>
                The Platform and/or the Services are controlled, hosted, and operated from India.
                This Agreement will be governed by the laws of India without regard to conflicts of law provisions thereof. All disputes relating to or arising out of this Agreement shall be resolved in the courts located in Pune, and the parties hereby consent to the jurisdiction of such courts.
              </p>
            </div>

          </Card>
        </div>
      </main>
      {/* Back to top button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:scale-105 transition"
        >
          ↑
        </button>
      )}

      <Footer />

    </div>
  )
}
