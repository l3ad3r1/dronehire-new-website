// Verbatim legal copy from the DroneHire legal documents, rendered in the
// SkyCommand design system. Internal .html links rewritten to Next routes.

export interface LegalPage {
  slug: string;
  /** Small mono eyebrow above the title. */
  eyebrow: string;
  title: string;
  updated: string;
  /** Short meta description for <head>. */
  description: string;
  /** Body HTML — styled by the `.legal-prose` rules in globals.css. */
  html: string;
}

export const PRIVACY: LegalPage = {
  slug: "privacy",
  eyebrow: "Legal",
  title: "Privacy policy",
  updated: "Last updated: June 2026",
  description:
    "How DroneHire collects, uses, and protects your personal information.",
  html: `
  <h2>Who we are</h2>
  <p>DroneHire ("we", "us", "our") is a drone pilot booking platform based in Hyderabad, Telangana. We connect clients who need aerial photography and survey work with DGCA-licensed drone pilots operating in and around Hyderabad. Our website is <a href="https://dronehire.in" target="_blank" rel="noopener noreferrer">dronehire.in</a>.</p>

  <h2>What information we collect</h2>
  <p>When you use DroneHire — whether as a client booking a shoot or a pilot registering on our platform — we may collect:</p>
  <ul>
    <li><strong>Contact details:</strong> name, phone number (including WhatsApp), and email address.</li>
    <li><strong>Shoot details:</strong> type of shoot, location within Hyderabad, preferred date, and any special instructions you share with us.</li>
    <li><strong>Pilot credentials:</strong> DGCA Remote Pilot Certificate number, aircraft details, and coverage areas you provide during registration.</li>
    <li><strong>Usage data:</strong> pages visited on our website, browser type, and device information collected via standard web analytics.</li>
  </ul>
  <p>We do <strong>not</strong> collect payment card numbers or banking details. Payment is arranged directly between you and DroneHire or the assigned pilot.</p>

  <h2>How we use your information</h2>
  <ul>
    <li>To match client bookings with suitable DGCA-licensed pilots in the right area of Hyderabad.</li>
    <li>To confirm shoot bookings and send relevant details to both client and pilot via WhatsApp or email.</li>
    <li>To contact you about the status of your shoot or application.</li>
    <li>To improve our platform, pricing, and pilot network over time.</li>
    <li>To comply with Indian regulations, including DGCA requirements for commercial drone operations.</li>
  </ul>

  <h2>WhatsApp and messaging</h2>
  <p>DroneHire uses WhatsApp as its primary communication channel. When you initiate a booking or pilot application via our WhatsApp link, you are starting a conversation with our team. Message content is stored within WhatsApp and is subject to Meta's own privacy policy in addition to ours.</p>
  <p>We will only contact you via WhatsApp in connection with a booking or application you have started. We do not send unsolicited promotional messages.</p>

  <h2>How we share your information</h2>
  <p>We share limited information with third parties only where necessary:</p>
  <ul>
    <li><strong>Assigned pilot:</strong> Once a booking is confirmed, we share your name, shoot location, shoot date, and shoot type with the assigned pilot. We do not share your full phone number without your consent.</li>
    <li><strong>Client:</strong> Once a pilot is assigned, we share the pilot's name and DGCA certificate number with the client for verification.</li>
    <li><strong>Legal compliance:</strong> We may disclose information where required by Indian law, DGCA regulation, or lawful government request.</li>
  </ul>
  <p>We do not sell, rent, or trade your personal information to any third party for marketing purposes.</p>

  <h2>Data storage and security</h2>
  <p>Your information is stored in standard business tools (Google Workspace, WhatsApp). We take reasonable precautions to protect your data but cannot guarantee absolute security of any information transmitted over the internet.</p>
  <p>We retain booking and pilot information for up to three years for record-keeping and dispute resolution purposes, after which it is deleted.</p>

  <h2>Your rights</h2>
  <p>Under India's Digital Personal Data Protection Act (DPDPA), 2023, you have the right to:</p>
  <ul>
    <li>Access the personal data we hold about you.</li>
    <li>Correct inaccurate personal data.</li>
    <li>Request deletion of your data (subject to any legal retention obligations).</li>
    <li>Withdraw consent for future processing.</li>
  </ul>
  <p>To exercise any of these rights, contact us at <a href="mailto:hello@dronehire.in">hello@dronehire.in</a> or on WhatsApp at <a href="https://wa.me/919645179861" target="_blank" rel="noopener noreferrer">+91 96451 79861</a>.</p>

  <h2>Cookies</h2>
  <p>Our website uses minimal cookies necessary for basic functionality. We do not currently use advertising or tracking cookies. Standard server logs may record your IP address and browser information for security purposes.</p>

  <h2>Changes to this policy</h2>
  <p>We may update this policy from time to time. The "Last updated" date at the top of this page will reflect any changes. Continued use of DroneHire after changes constitutes acceptance of the updated policy.</p>

  <div class="contact-box">
    <h3>Questions about privacy?</h3>
    <p>Contact us at <a href="mailto:hello@dronehire.in">hello@dronehire.in</a> or WhatsApp <a href="https://wa.me/919645179861" target="_blank" rel="noopener noreferrer">+91 96451 79861</a>. We'll respond within 48 hours.</p>
  </div>
  `,
};

export const TERMS: LegalPage = {
  slug: "terms",
  eyebrow: "Legal",
  title: "Terms of service",
  updated: "Last updated: June 2026",
  description:
    "The terms governing your use of the DroneHire booking platform.",
  html: `
  <h2>Agreement to terms</h2>
  <p>By accessing or using DroneHire's website, booking a shoot via WhatsApp, or registering as a pilot, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
  <p>DroneHire operates as a booking platform and intermediary between clients who require aerial photography/survey services and DGCA-licensed drone pilots in Hyderabad, Telangana.</p>

  <h2>Services provided</h2>
  <p>DroneHire provides a platform to:</p>
  <ul>
    <li>Connect clients with verified, DGCA-licensed drone pilots in Hyderabad.</li>
    <li>Facilitate booking of aerial photography, videography, and survey services.</li>
    <li>Coordinate shoot logistics including matching, confirmation, and delivery.</li>
  </ul>
  <p>DroneHire is a <strong>booking intermediary</strong>, not the direct provider of drone services. The licensed pilot assigned to your shoot is an independent professional, not an employee or agent of DroneHire.</p>

  <h2>Bookings and confirmation</h2>
  <ul>
    <li>All bookings are initiated via WhatsApp at <a href="https://wa.me/919645179861" target="_blank" rel="noopener noreferrer">+91 96451 79861</a>.</li>
    <li>A booking is confirmed only after you receive a written confirmation from DroneHire with the assigned pilot's details, shoot date, and agreed price.</li>
    <li>Prices quoted are estimates and subject to final confirmation based on location, complexity, and weather conditions.</li>
    <li>DroneHire reserves the right to decline any booking at its discretion.</li>
  </ul>

  <h2>Client responsibilities</h2>
  <ul>
    <li>Ensure that the proposed shoot location is legally permissible for drone operations under DGCA regulations and local bylaws.</li>
    <li>Obtain any necessary property permissions or approvals from landowners or authorities.</li>
    <li>Provide accurate shoot details (location, date, type) at the time of booking.</li>
    <li>Be available or have a representative present at the shoot location at the agreed time.</li>
    <li>Not request pilots to fly in restricted airspace, during prohibited hours, or in unsafe weather conditions.</li>
  </ul>

  <h2>DGCA compliance</h2>
  <p>All pilots on the DroneHire platform hold a valid DGCA Remote Pilot Certificate (RPC) and operate in compliance with India's Drone Rules 2021 and applicable UAS regulations. However, DroneHire does not guarantee that every proposed shoot location is within a permissible zone. Clients are responsible for verifying DGCA ATC/ANO permissions for their specific location where required.</p>
  <p>Certain areas in and around Hyderabad — including RGIA airport vicinity, Secunderabad Cantonment, and other notified zones — may require additional permissions. DroneHire will advise if we are aware of restrictions but cannot be held liable for regulatory violations resulting from client-provided location information.</p>

  <h2>Payment and delivery schedule</h2>
  <p>Payment is made in two installments: <strong>50%</strong> of the agreed quote as a deposit to confirm your booking and reserve your pilot, and the remaining <strong>50%</strong> after the edited footage is delivered.</p>
  <ul>
    <li>DroneHire confirms the final amount before the shoot.</li>
    <li>Payment is accepted via UPI or bank transfer.</li>
    <li>DroneHire aims to deliver edited footage within 48 hours of the shoot. In the event of unforeseen delays, our liability is limited to a 10% discount on the final invoice for delays exceeding 72 hours from the scheduled delivery time.</li>
  </ul>

  <h2>Intellectual property</h2>
  <p>All footage, photographs, and deliverables produced during a shoot are the property of the client upon full payment. DroneHire and the assigned pilot may retain the right to use footage as portfolio samples unless you request otherwise in writing at the time of booking.</p>

  <h2>Limitation of liability</h2>
  <p>DroneHire's liability in connection with any shoot is limited to the amount paid for that specific booking. We are not liable for:</p>
  <ul>
    <li>Cancellations due to weather, DGCA restrictions, or force majeure events.</li>
    <li>Loss, damage, or injury caused by drone operations conducted by independent pilots.</li>
    <li>Delays in footage delivery beyond our stated 48-hour window due to unforeseen circumstances.</li>
    <li>Third-party claims arising from shoot content created at the client's direction.</li>
  </ul>

  <h2>Prohibited uses</h2>
  <p>You may not use DroneHire's services to:</p>
  <ul>
    <li>Conduct surveillance of individuals without their knowledge or consent.</li>
    <li>Capture footage over private property without the owner's permission.</li>
    <li>Operate in restricted or prohibited airspace.</li>
    <li>Create content that is defamatory, illegal, or violates the rights of others.</li>
  </ul>

  <h2>Governing law</h2>
  <p>These Terms are governed by the laws of India and the state of Telangana. Any disputes shall be subject to the exclusive jurisdiction of courts in Hyderabad, Telangana.</p>

  <h2>Changes to terms</h2>
  <p>We may update these Terms at any time. The "Last updated" date reflects the most recent revision. Continued use of DroneHire after changes constitutes your acceptance.</p>

  <div class="contact-box">
    <h3>Questions about these terms?</h3>
    <p>Email us at <a href="mailto:hello@dronehire.in">hello@dronehire.in</a> or WhatsApp <a href="https://wa.me/919645179861" target="_blank" rel="noopener noreferrer">+91 96451 79861</a>.</p>
  </div>
  `,
};

export const REFUND: LegalPage = {
  slug: "refund",
  eyebrow: "Legal",
  title: "Cancellation & refund policy",
  updated: "Last updated: June 2026",
  description:
    "How DroneHire handles cancellations, rescheduling, and refunds.",
  html: `
  <h2>Our promise</h2>
  <p>DroneHire operates on a simple <strong>50/50</strong> model: a 50% deposit confirms your booking and reserves your pilot, and the remaining 50% is due only after your edited footage is delivered. You never pay the full amount before you've seen the work.</p>
  <p>We understand that shoots sometimes need to be rescheduled or cancelled. This policy explains how we handle those situations fairly for both clients and pilots.</p>

  <h2>Client cancellations</h2>
  <table>
    <thead>
      <tr>
        <th>When you cancel</th>
        <th>Charge / refund</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>More than 48 hours before the shoot</td>
        <td>No charge. Your 50% deposit is fully refunded.</td>
      </tr>
      <tr>
        <td>24–48 hours before the shoot</td>
        <td>25% of the shoot price is retained from your deposit as a cancellation fee; the balance is refunded.</td>
      </tr>
      <tr>
        <td>Less than 24 hours before the shoot</td>
        <td>A cancellation fee of ₹500–₹1,500 (depending on shoot type) is retained to cover pilot travel and preparation; any remaining deposit is refunded.</td>
      </tr>
      <tr>
        <td>No-show on shoot day</td>
        <td>50% of the agreed shoot price (your deposit) is retained.</td>
      </tr>
    </tbody>
  </table>
  <p>To cancel, WhatsApp us at <a href="https://wa.me/919645179861" target="_blank" rel="noopener noreferrer">+91 96451 79861</a> as early as possible. All cancellation requests must be made in writing via WhatsApp or email.</p>

  <h2>Rescheduling</h2>
  <p>You can reschedule a confirmed shoot at no charge, provided you give at least <strong>24 hours' notice</strong>. Rescheduling within 24 hours of the shoot may incur a ₹500 rescheduling fee to cover pilot costs.</p>
  <p>We will do our best to accommodate your preferred new date and time, subject to pilot availability.</p>

  <h2>Cancellation by DroneHire</h2>
  <p>We may cancel or reschedule a shoot in the following circumstances, with no charge to you:</p>
  <ul>
    <li><strong>Weather:</strong> If conditions on shoot day are unsafe for drone operations (high winds, rain, low visibility) as assessed by our pilot.</li>
    <li><strong>DGCA or regulatory hold:</strong> If an ATC restriction, NOTAM, or temporary flight restriction is issued for the shoot area.</li>
    <li><strong>Pilot unavailability:</strong> If the assigned pilot has an emergency and we are unable to find a replacement in time.</li>
    <li><strong>Location issues:</strong> If on-site inspection reveals that the shoot location is unsafe or legally impermissible to fly.</li>
  </ul>
  <p>In any of these cases, we will contact you immediately and offer a full refund or a priority rescheduling at no extra cost.</p>

  <h2>Refunds</h2>
  <p>Where a refund is due, we process it within <strong>5 business days</strong> to your original payment method (UPI, bank transfer, etc.).</p>
  <p>If you are dissatisfied with delivered footage, please contact us within <strong>48 hours of delivery</strong>. We will review your feedback and work with the pilot to re-deliver or, where the issue is our fault, offer a partial or full refund at our discretion.</p>

  <h2>Footage delivery guarantee</h2>
  <p>We aim to deliver edited footage within 48 hours of your shoot. If delivery is delayed beyond 72 hours without prior communication from our team, you are entitled to a 10% discount on the final invoice.</p>

  <div class="contact-box">
    <h3>Need to cancel or have a question?</h3>
    <p>WhatsApp us at <a href="https://wa.me/919645179861" target="_blank" rel="noopener noreferrer">+91 96451 79861</a> or email <a href="mailto:hello@dronehire.in">hello@dronehire.in</a>. We respond within a few hours.</p>
  </div>
  `,
};

export const PILOT_AGREEMENT: LegalPage = {
  slug: "pilot-agreement",
  eyebrow: "For pilots",
  title: "Pilot agreement",
  updated: "Last updated: June 2026",
  description:
    "The terms that apply when you register as a DroneHire pilot.",
  html: `
  <div class="highlight-box">
    <h3>This agreement applies to you</h3>
    <p>By registering as a pilot on DroneHire — whether via the sign-up form at <a href="/pilots">dronehire.in/pilots</a> or via WhatsApp — you agree to the terms set out in this document. Please read it carefully before applying.</p>
  </div>

  <h2>Who can join</h2>
  <p>DroneHire is a platform for professional, DGCA-licensed drone pilots in Hyderabad and surrounding districts. To be eligible, you must:</p>
  <ul>
    <li>Hold a valid <strong>DGCA Remote Pilot Certificate (RPC)</strong> at the time of registration and maintain it throughout your engagement with DroneHire.</li>
    <li>Own or have regular access to a drone that meets DGCA's categorisation and airworthiness requirements for the shoots you intend to accept.</li>
    <li>Have a reliable, working WhatsApp number on which you are reachable during business hours.</li>
    <li>Be based in or able to operate regularly in Hyderabad or surrounding areas (Rangareddy, Medchal, Sangareddy districts).</li>
  </ul>

  <h2>Independent contractor status</h2>
  <p>You are engaged as an <strong>independent contractor</strong>, not an employee of DroneHire. This means:</p>
  <ul>
    <li>You are free to accept or decline any shoot offer sent to you.</li>
    <li>You set your own working hours and are responsible for your own equipment, insurance, and expenses.</li>
    <li>DroneHire does not deduct or withhold taxes on your behalf. You are responsible for your own tax compliance under Indian law.</li>
    <li>You do not receive employee benefits, PF, ESI, or any other employment entitlements from DroneHire.</li>
  </ul>

  <h2>How shoots are assigned</h2>
  <ul>
    <li>When a client books a shoot, DroneHire will send you a shoot brief via WhatsApp — including type, location, date, and estimated fee.</li>
    <li>You must accept or decline within <strong>2 hours</strong> of receiving the offer. No response within 2 hours will be treated as a decline.</li>
    <li>Once you accept, you are committed to completing the shoot on the agreed date and time.</li>
    <li>DroneHire will introduce you to the client via WhatsApp for shoot-day coordination.</li>
  </ul>

  <h2>Your responsibilities on the shoot</h2>
  <ul>
    <li>Arrive at the shoot location on time and ready to fly.</li>
    <li>Conduct a pre-flight check and ensure your equipment is in airworthy condition.</li>
    <li>Comply with all DGCA regulations, ATC requirements, and local bylaws applicable to the shoot location.</li>
    <li>Before flying, confirm with DroneHire or the client that any required property permissions, location approvals, and airspace clearances are in place. If permissions are unclear or missing, do not fly and notify DroneHire immediately — this protects you from liability for an unauthorised flight.</li>
    <li>Do not fly in restricted zones, during prohibited hours, or in unsafe weather conditions.</li>
    <li>Capture footage to the agreed brief and specifications (resolution, type of shots, duration).</li>
    <li>Deliver raw and/or edited footage to DroneHire within <strong>24 hours</strong> of the shoot (edited within 48 hours unless otherwise agreed).</li>
    <li>Treat clients professionally and courteously at all times.</li>
  </ul>

  <h2>Payment to pilots</h2>
  <ul>
    <li>DroneHire pays pilots within <strong>48 hours</strong> of confirmed footage delivery.</li>
    <li>Payment is made via UPI or bank transfer to the account details you register with us.</li>
    <li>The fee for each shoot will be agreed before you accept the booking. DroneHire's service fee is deducted before payment is made to you.</li>
    <li>No payment is due for shoots that are cancelled before commencement, except where a cancellation fee is expressly agreed in writing.</li>
  </ul>

  <h2>Pilot conduct and quality standards</h2>
  <p>DroneHire maintains a quality standard to ensure clients receive professional output. Pilots are expected to:</p>
  <ul>
    <li>Deliver footage at a minimum of 4K resolution (where equipment permits) or as specified in the booking brief.</li>
    <li>Apply basic colour grading and stabilisation for video deliverables unless raw footage is requested.</li>
    <li>Respond promptly to client queries shared via DroneHire during the booking process.</li>
    <li>Notify DroneHire immediately if you are unable to complete a booked shoot due to equipment failure, weather, or emergency.</li>
  </ul>
  <p>Repeated low-quality deliverables, no-shows, or unprofessional conduct may result in removal from the DroneHire network.</p>

  <h2>Insurance and liability</h2>
  <p>Each pilot is responsible for obtaining and maintaining appropriate <strong>third-party liability insurance</strong> for commercial drone operations. DroneHire strongly recommends this coverage and may require proof at any time.</p>
  <p>DroneHire is not liable for any loss, damage, injury, or legal claims arising from a pilot's drone operations. By accepting a shoot, you accept full operational responsibility and liability for the flight.</p>

  <h2>Intellectual property</h2>
  <p>Footage captured during a DroneHire booking is delivered to the client and DroneHire. You retain no right to distribute, sell, or license footage captured under a DroneHire booking to third parties without explicit written consent from the client. You may include samples in a personal portfolio unless the client has requested confidentiality.</p>

  <h2>Termination</h2>
  <p>Either party may end this arrangement at any time by providing written notice via WhatsApp or email. DroneHire may immediately suspend a pilot from the network if they breach DGCA regulations, commit fraud, behave inappropriately with clients, or fail to meet quality standards on repeated occasions.</p>

  <h2>Amendments</h2>
  <p>DroneHire may update this agreement from time to time. We will notify registered pilots via WhatsApp of any material changes. Continued acceptance of shoot offers after notification constitutes acceptance of the updated terms.</p>

  <div class="contact-box">
    <h3>Ready to join? Apply now.</h3>
    <p>Register as a pilot at <a href="/pilots">dronehire.in/pilots</a> — it takes two minutes. Or reach us directly on WhatsApp.</p>
    <a class="cta-btn" href="https://wa.me/919645179861?text=Hi%2C%20I%20am%20a%20DGCA-licensed%20pilot%20in%20Hyderabad%20and%20want%20to%20join%20DroneHire" target="_blank" rel="noopener noreferrer">💬 WhatsApp to apply</a>
  </div>
  `,
};

export const LEGAL_PAGES: LegalPage[] = [PRIVACY, TERMS, REFUND, PILOT_AGREEMENT];

export const LEGAL_NAV_LINKS = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
  { label: "Cancellations & refunds", href: "/refund" },
  { label: "Pilot agreement", href: "/pilot-agreement" },
];
