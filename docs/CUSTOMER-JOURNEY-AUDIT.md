# Customer journey, trust and positioning audit

Audit date: 29 September 2026. English is the primary language; all changes also have curated Turkish copy.

## Scope and evidence standard

This is an internal qualitative review through four **simulated visitor perspectives**, followed by implementation and browser checks. It is not a study of recruited customers, a conversion experiment or evidence that anyone actually decided to buy. References to remembering, returning or recommending describe a reason the experience now provides, not a measured outcome.

The initial journeys used the public website. Publicly visible copy, controls, disclosures, founder destinations and contact actions supplied the evidence; project history was not used to fill gaps in what a stranger could understand. The perspectives were kept separate: a cold buyer has to establish relevance and trust from nothing; a referred buyer checks a recommendation; a curious stranger needs a reason to explore; a referred non-buyer needs a useful explanation to carry away.

The table below records before → after differences in the implemented experience. Four repeat perspectives and the local checks are recorded separately below; publication verification remains a separate final step. No numerical persona scores were added to the site or invented for this report.

Baseline: public GitHub Pages revision `bfb1b55` (the mobile line-icon correction). The changes reviewed here are proportional copy, navigation, founder-discovery and experiment-sharing changes. They preserve the hero headline, art direction, custom cursor, interactive prototypes, motion controls and three distinct lab environments.

## Four initial journeys

### Visitor 01 — cold, active project

Scenario: a stranger comparing potential partners for custom software or AI-assisted internal operations. There is no referral to supply trust.

The first screen demonstrated visual taste immediately, but “software, intelligence and experiences” was broad. The visitor had to interpret the category strip or continue to capabilities to establish that the studio also builds SaaS and internal systems. Capabilities followed three long experiments, so a linear visit reached explicit service detail late; the header navigation offered a useful shortcut for visitors who noticed it.

The journey inspected all four capability tabs and used the prototypes. In AI OPERATIONS, excluding the task source, running the agent, reviewing proposals and applying the selected CRM/communication changes showed that the interface did more than animate a prewritten dashboard. FLOW's automatic sequence and trace demonstrated connected steps. SIGNAL's mode changes showed interaction craft. The AI-native section's staged example was also inspected. These are useful demonstrations of decisions and implementation, while their local, scripted nature remains a limit on what they prove about a real deployment.

Studio copy promised direct collaboration but offered little detail about the steps of an engagement. Contact was easy to find and email copying worked, yet the visitor was left to decide how formal a first brief had to be and what a reply would begin. Names added a human layer; failed personal-site destinations weakened it.

Shortlist interpretation: distinctive execution and controlled prototypes justified a technical-fit conversation. Broad first-screen language and weak expectations around the first exchange could lose a buyer comparing several tabs. There was no evidence that would justify claiming established client delivery, enterprise scale or guaranteed outcomes.

### Visitor 02 — cold, curious, no active project

Scenario: a stranger following an interesting creative-technology link without a budget or a current brief.

This journey explored the hero interaction, changed its word to “WONDER” and adjusted the direction control. The responsive visual and later reuse of the visitor's word in the contact composition made the page feel authored and connected. The three labs gave the visitor distinct things to try without requiring contact details. All visible English sections were read during the baseline review; the visual experience supplied more immediate motivation than the abstract service wording.

The weakness was the association carried away: the visitor could remember an unusual interactive website before remembering which business problems the studio builds for. The capabilities supplied that information later, but the lab-to-service relationship required interpretation. There was no small, direct action to keep or share a particular experiment. The Arda personal-site link failed, ending that optional curiosity path.

The appropriate outcome for this visitor is exploration plus a concrete association with software, AI and automation. A contact demand, newsletter or intrusive capture form would not address the observed gap. No claim is made that the simulated visitor would remember the name after 24 hours or return six months later.

### Visitor 03 — referred, active project

Scenario: a buyer arrives after someone has recommended Atashalci Labs. The site must validate a positive expectation and let the buyer judge project fit.

The journey inspected every capability and AI-native process stage, ran FLOW, changed SIGNAL and reviewed AI OPERATIONS with reduced sources. Keeping only knowledge and communication sources produced the corresponding communication proposal rather than pretending to have information from excluded systems. Explicit prototype disclosure and human approval were strong trust signals. They made the recommendation feel more credible without presenting fictional client results.

The visitor could identify a focused Istanbul studio with design and engineering range. However, the strongest opening impression still favored a creative web studio over internal systems. The referral continued to carry more delivery confidence than the site could independently establish. Architecture, testing and infrastructure statements describe an offer; they are not evidence of completed production projects.

Both email-copy paths in EN/TR worked. The founder names and direct-collaboration statement were helpful, but founder context was thin and the external destinations failed. Contact did not say what information would start a useful conversation. The visitor had a reason to inquire, with important commercial and technical questions appropriately left for that conversation.

### Visitor 04 — referred, curious, no active project

Scenario: someone has mentioned the studio, but the visitor has no present need. The useful outcome is knowing what kind of opportunity to refer later.

The baseline journey read the English page, capability tabs and process stages, advanced FLOW manually before trying automatic mode, explored the labs and checked Turkish email copying. It could explain the company as a small Istanbul creative-technology studio combining custom software, AI systems, automation and interface design. This explanation was possible after exploration, rather than immediate.

Honest self-initiated labels made the labs safe to recommend as demonstrations. The distinction matters: sending an interactive example is not endorsing a supposed client result. Both founder sites failed independently, so deeper discovery ended at the names. The page provided enjoyable exploration but no convenient way to pass along the particular demonstration that matched a colleague's problem.

The best improvement is a clearer category association and a shareable experiment destination, while allowing this visitor to leave without a sales conversation. Long-term advocacy remains a hypothesis, not a measured result.

## Shared diagnosis and implemented response

| Priority | Observed problem | Implemented response | What the change can establish |
| --- | --- | --- | --- |
| 1 — trust | Both founder destinations failed DNS resolution in independent browser visits and a later resolver check. | Present the two verified partners as noninteractive profile rows. Retain the exact supplied URLs in `data-profile-url` and the visible domains. Clearly say the personal sites are currently unavailable; remove link/arrow/hover invitations into the failed destination. | Visitors can identify the humans without being sent into a dead end. It does not invent a reason for the outage or claim that the sites are permanently unavailable. |
| 2 — positioning | The opening was visually distinctive but broad about the actual offer. | Preserve the headline and replace its supporting sentence with custom software, AI automation, SaaS products and distinctive websites. Add a quiet “What we build” / “Neler geliştiriyoruz” anchor to capabilities. | A stranger can identify the service categories before navigating the long page. |
| 3 — relevance | Technology lists alone required a buyer to infer the application to their work. | Refine all four capability purposes and details around customer products, internal tools, disconnected spreadsheets, source-connected workflows, human approval, understandable digital experiences and complete application flows. | Visitors can recognize a type of need. These remain descriptions of the offer, not historical project claims. |
| 4 — evidence interpretation | The labs rewarded exploration, but the relationship to an actual business or digital-experience problem was implicit. | Add one concise context paragraph beneath each lab heading: internal-operations proposals, enquiry handling, and live typography/depth/motion. Preserve self-initiated/prototype disclosures and all local-state behavior. | Visitors understand what to inspect and why it relates to the studio's capabilities. |
| 5 — purchase friction | Contact was accessible but did not explain what to send or what would happen first. | Ask for what the visitor wants to build, who it is for and what is getting in the way; explicitly welcome a rough outline. Explain that the first conversation clarifies the problem, team fit, scope and next steps. Add one contextual contact link after capabilities. | The next action is less ambiguous. No response-time, pricing, availability or delivery promise is invented. |
| 6 — process credibility | Broad AI-native and process language left room to read the studio as mainly a user of AI tools. | Specify that AI supports exploration and implementation while architecture, testing and release decisions stay with the studio. Make process captions concrete: understand constraints, agree scope, test interactions, review stages, test the complete flow and prepare handover. | Human responsibility and a proposed working method become clearer. This is not a certification or evidence of past delivery. |
| 7 — human connection | The names were present but the working relationship was underspecified. | State the verified partner role for both names and explain direct collaboration with the two studio partners from problem definition to build review. | A prospect knows who the collaboration is with, without invented individual specialties, biographies or experience. |
| 8 — return/share utility | Curious visitors had no lightweight way to keep a specific experiment. | Add a small “Copy experiment link” action to each lab, with localized success feedback and a selectable-link fallback when clipboard access fails. | A visitor can keep or share a specific demonstration without supplying contact details. It is not a saved interactive-state permalink. |

The first-screen Turkish sentence was adapted as “Özel yazılım, AI destekli otomasyon, SaaS ürünleri ve özgün web siteleri geliştiriyoruz.” The contact guidance uses respectful, natural Turkish and the same low-pressure meaning as English. Brands, email, partner names, personal domains, lab identifiers and established technical terms remain consistent.

No fake clients, testimonials, portfolio cases, statistics, awards, years of experience or team-size claims were added. There is no LinkedIn destination. The company email remains `info@atashalci.com`. No additional contact platform, booking system, popup or newsletter was introduced.

## Fifteen-dimension comparison

Each cell is **baseline → revised experience**. The “after” describes the actual intervention and its plausible qualitative effect; it is not a statement of observed conversion or long-term behavior. The completed repeat perspectives below qualify the implementation-level judgments.

| Dimension | 01 — cold / high intent | 02 — cold / no current intent | 03 — warm / high intent | 04 — warm / no current intent |
| --- | --- | --- | --- | --- |
| 1. First impression | Strong taste, unclear software breadth → concrete software/AI/SaaS/web offer accompanies the same headline. | Intriguing visual without an immediate category → the interaction now has an explicit creative-technology offer beside it. | Referral meets polished craft, initially web-led → the recommended software/automation offer is visible immediately. | Name becomes a strong aesthetic impression → the first screen also explains what the recommendation concerns. |
| 2. Understanding | Needed the lower capability tabs → opening sentence plus a direct capability anchor supply a usable mental model. | Could understand after exploring → service names are available before playing. | Could verify the offer with several steps → scope is easier to confirm and expand through tabs. | Could explain the studio after a full visit → has a concise explanation earlier. |
| 3. Relevance | Lists required translating technology into a business use → product, team workflow and approval examples show recognizable needs. | No reason to buy, uncertain future association → the same examples indicate when the studio might become useful. | Fit was discoverable, but broad → workflow and system descriptions help check the referred need. | General “creative technology” recommendation → clearer cues for software, AI automation and interactive-web opportunities. |
| 4. Curiosity | Art direction earned a look, possibly delayed fit checking → kept the interaction and added a shortcut for task-focused browsing. | Hero and labs already rewarded play → kept those rewards and added explanations without sales interruption. | Demonstrations supported deeper examination → context gives a more focused reason to inspect their behavior. | Interesting recommendation validated through play → lab explanations aid exploration and later explanation. |
| 5. Trust | Honest demos, but external founder dead ends → clear demo limits remain; failed destinations no longer masquerade as working links. | Labels prevented fake-portfolio impressions → continued transparency plus honest unavailable-profile treatment. | Referral trust reinforced by review controls, weakened by failed links → more coherent verification path with no fabricated authority. | Safe to describe experiments as experiments → equally clear boundaries when sharing them. |
| 6. Credibility | Craft visible, delivery record unproven → responsibilities and working steps are clearer; delivery history remains unproven. | High visual skill, less concrete engineering meaning → AI and engineering responsibility is explained in plain terms. | Referral carried production confidence → the site states a method more precisely without pretending to replace due diligence. | Understandable small studio, shallow professional context → verified partner relationship and a clearer method support a more accurate description. |
| 7. Differentiation | Strong design plus functional demos, weak verbal connection → software and creative interaction are explicitly part of one offer. | Memorable hero and SIGNAL → retain both and connect them with software/automation rather than pure visual spectacle. | Distinctive combined design/engineering promise → combination becomes easier to articulate while evaluating fit. | Memorable look, recommendation category less immediate → a distinctive studio with more concrete referral categories. |
| 8. Proof of capability | Source-sensitive Ops, FLOW trace and SIGNAL controls demonstrated behavior → context explains what each behavior can illustrate; no client-proof upgrade is claimed. | Labs could be enjoyed without understanding their purpose → brief framing gives the interaction meaning. | Detailed controls justified further technical discussion → the same controls remain primary evidence and their limits stay explicit. | Functional examples were safe to pass along → individual deep links make the evidence easier to show someone. |
| 9. Human connection | Two names but no precise working relationship; broken onward links → verified partner labels and direct collaboration statement. | Optional founder exploration ended in failure → names and domains remain visible with honest availability information. | Wanted to know whom the buyer would hire → direct work with two partners is now stated. | People helped make the name tangible → partner identity is clearer, with no invented biography. |
| 10. Navigation clarity | Long linear path before capabilities → quiet hero-to-capabilities and capabilities-to-contact anchors. | Exploration path worked → preserved; sharing does not redirect or interrupt demos. | Immediate header contact was available → contextual contact after fit assessment removes a return search. | Labs easy to browse, harder to revisit precisely → each lab now has a copyable location. |
| 11. Contact friction | Email was simple, briefing expectations unclear → rough outline is welcomed and first discussion is explained. | No need to contact → no forced capture or extra sales surface. | Email easy, seriousness of first message uncertain → practical brief guidance makes the next step clearer. | Contact available when needed → remains secondary to understanding and exploration. |
| 12. Memorability | May retain visual craft before the relevant offer → software, AI and automation now accompany the memorable interaction. | “That animated site” risk → retains the interactive hook with a stronger category association and a keep-link action. | Strong craft supports shortlist memory → system relevance is easier to associate with the studio name. | Name plus unusual visuals → concrete types of work and a lab link provide additional memory cues. |
| 13. Likelihood to return | Could revisit by home URL → more direct paths help recheck fit; actual return rate unknown. | No reason beyond playing again → can deliberately keep a specific experiment; actual recall and return unmeasured. | Revisit for a serious discussion was plausible → scope and next-step information can be found quickly again. | No convenient demonstration bookmark → localized lab links provide a practical return destination, without a measured behavioral claim. |
| 14. Likelihood to recommend | Could point to taste, less precise about offer → clearer problem examples support a more accurate recommendation. | Could share a visually interesting homepage → can share a relevant named experiment instead. | Could relay a referral but relied on its prior trust → can accompany an introduction with transparent examples and a clear offer. | Could describe the studio after full exploration → easier to pair an opportunity with a specific example. |
| 15. Likelihood to contact when appropriate | Enough to consider a discussion, avoidable ambiguity remained → a clearer fit and lower-effort first message support inquiry, not a claimed sale. | No active buying need → no pressure added; clearer association may help at a later relevant moment. | Reason to inquire existed → expectations for the first exchange are more concrete. | Contact not today's goal → studio purpose and email remain easy to recover if a relevant opportunity appears. |

## Repeat checks recorded so far

These are observations from the revised local build, separate from the simulated behavioral conclusions. “Passed” below means the named check succeeded; it does not certify every browser, every assistive technology or real-world customer behavior.

### Functional and language checks completed

- **82 Node tests and 12 route tests passed.** The build/check pass reported **434 paired localization keys**. No user-visible copy was sent to an external translation service.
- **18 responsive layouts** were checked: English and Turkish at widths **1920, 1440, 1366, 1280, 1024, 768, 430, 390 and 375**. The document did not horizontally overflow. A few decorative icons extend a few pixels within existing margins; no text clipping was observed in those checks.
- At **375px in Turkish**, screenshots of the hero, contact, studio process, partner rows and AI OPERATIONS were inspected. At **1440px in English**, the hero, studio and contact were also visually inspected. No overlaps were observed in these captures.
- AI OPERATIONS approval, FLOW automatic execution and SIGNAL state were checked across EN/TR changes. The observed lab selections/results were preserved through switching; sharing does not reset prototype controllers.
- Actual clipboard payloads were captured in the root review and an independent agent review. They used the current localized path and correct lab hash, removed query parameters and did not claim to serialize the prototype state.
- When clipboard access was unavailable/rejected, the UI exposed the real URL in a read-only field, selected it for manual copying and showed the manual instructions. Changing language updated this URL and its instruction. Changing language after a successful copy cleared the old success message; pending copy completions were also prevented from reporting a success for the newly selected language.
- Each sharing button is a native keyboard-accessible button with a minimum 44px target. The footer remains hidden until its controller is initialized, and fallback inputs have localized accessible labels and an associated status message.

### Persona repeat-visit record

Each perspective was revisited after the revisions. Root review completed the paths that independent agents could not finish because of their execution limits; those interruptions were not treated as completed independent reviews or as site failures. Mobile repeat paths used 375px, with fresh page/interaction starts for the distinct perspectives.

| Repeat perspective | Revised visit and specific observations | Result and remaining limits |
| --- | --- | --- |
| 01 — cold / high intent | Root completed the mobile path: source-controlled Ops approval without Tasks → Turkish switch with state retained → automatic FLOW → SIGNAL Contour → English switch with state retained → AI capability → contact and email copy. The opening gave the concrete offer before the experiments. | The buyer can identify relevance, inspect controlled behavior and reach contact without a new form or interrupted demo. The labs still cannot establish past commercial delivery. |
| 02 — cold / no current intent | After the independent agent's partial opening/Ops-sharing pass, root completed a fresh English mobile visit: word “WONDER,” direction 1%, experiment disclosure, an all-source Ops proposal, one manual FLOW step, SIGNAL Echo and sharing, product capability, then the sixth AI-native stage. Running that stage recorded discovery and a draft task. EN/TR switching retained the entered word and stage state; studio and contact guidance were read, and reload retained the explicit Turkish choice. | Exploration rewards remain intact and can be connected to a concrete service category. A particular lab can be kept or shared. Memory and future return are not measured by this immediate repeat. |
| 03 — warm / high intent | The independent revised visit checked the early capability shortcut, English contact and source-controlled Ops, then inspected Turkish. It identified imperative phrasing in three capability descriptions and awkward handover wording; these were corrected to studio first-person descriptions and “Teslime.” Root completed the mobile confirmation after reload: hero shortcut → engineering capability → contact, verifying the corrected Turkish, formal “fikrinizi” and visible email. | The referral-checking path provides concrete fit and first-contact expectations. The independent agent's final write-up was interrupted; root completed the outstanding path rather than counting that interruption as a complete independent result. |
| 04 — warm / no current intent | Independent full repeat: hero “BUILD”; inspect CRM, exclude Tasks and run Ops, producing a three-source proposal without Tasks; one manual FLOW step followed by automatic completion; SIGNAL Echo; all four capability tabs. Clipboard payloads were verified for English SIGNAL and Turkish FLOW. Switching EN/TR retained the word, Ops selection/result, FLOW completion, SIGNAL mode and capability tab. Email copying worked. | The offer is clearer immediately, the FLOW context explains why to explore, and the honest prototype positioning remains. Partner availability avoids the dead end but does not supply missing expertise or delivery proof. The visitor can accurately share an example without implying a completed client commission. |

### Mobile navigation, loading and release preparation

- The Turkish mobile menu remained open during an English switch, translated in place, and then closed correctly when its Studio link navigated to that section.
- With coarse-pointer/touch emulation, the desktop custom cursor was inactive. Language changes and lab controls continued to work.
- One **synthetic local loading observation**, at 390×844 with cache disabled, 150ms network latency, a 200,000-byte/s download limit and 4× CPU slowdown, recorded first contentful paint at **920ms**, the H1 as largest contentful paint at **920ms**, DOM content loaded at **1625ms**, and load at **1634ms**. No console errors or warnings were recorded during that observation. These are a single local emulation sample, not public GitHub Pages field measurements, a statistical benchmark or a speed guarantee.
- The loading observation showed the headline/offer appearing before completion of the page load. Understanding did not require waiting for a WebGL interaction or completing an animation.
- Temporary input/network/CPU emulation was restored after checking. The viewport override is reset when finishing browser review.
- The production-prefixed GitHub Pages build and validation passed, and the default local build was restored afterward. Publication verification is recorded separately below.
- Screenshot and check artifacts are stored in `../atashalci-labs-review/customer-journeys/` relative to the repository.

## Interpretation and limits

**The one-sentence explanation is now available immediately:** Atashalci Labs builds custom software, AI automation, SaaS products and distinctive websites. The capabilities add examples for someone checking a real need; the labs let that person inspect working local interactions.

**The labs are still not a client portfolio.** They demonstrate interface decisions, deterministic state, source-dependent proposals, review controls, sequential automation and creative web interaction. They do not establish real integrations, live AI quality, security review, operational resilience, production scale, delivery history or completed commercial outcomes. Those questions must be evaluated against an actual project and its constraints. No new copy claims that the experiments answer them all.

**The competitor-tab test remains a simulated comparison.** The reasons to keep this studio in a shortlist are the visible combination of visual judgment, software interaction, transparent experimentation and direct partner collaboration. The revised site reduces ambiguity about the offer; it cannot manufacture a delivery record. No competitor's layout or claims were copied.

**The 24-hour and six-month tests are thought experiments.** The expected memory cues are the name, the word/direction hero, three clearly named labs and the explicit software/AI/automation offer. Copyable experiment links provide a practical way to return. No actual recall, recommendation, retention or conversion rate was measured.

**Founder availability is a point-in-time observation.** Browser navigation to both supplied domains returned name-resolution errors, and a separate resolver check also failed on the audit date. The site says “currently unavailable,” without assigning cause. Restore clickable personal-site navigation only after the exact destinations work; keep partner identity and the company email primary. This audit does not schedule monitoring or change either external site.

**Performance has bounded local evidence.** Critical text is served in HTML and the throttled observation above showed it before page-load completion. This does not establish public field performance, low-end-device reliability across all devices or a guaranteed latency. No production speed score is inferred from the single local sample.

## Publication verification

Implementation revision `1f631e2266e0c8623151e6e34cf5737dc3e8a32c` was published successfully through [GitHub Pages workflow run 36522268701](https://github.com/atasardacagan/atashalci-labs/actions/runs/36522268701) on 29 September 2026. The workflow rebuilt and validated the bilingual site before deployment.

Public-browser verification confirmed the new opening, all three sharing controls, updated Turkish contact guidance and formal default contact wording. Copying FLOW produced the actual clipboard payloads `https://atasardacagan.github.io/atashalci-labs/#lab-002` and `https://atasardacagan.github.io/atashalci-labs/tr/#lab-002`. The previous success message cleared on language change. Both public routes returned HTTP 200, and the deployed interaction/style assets matched the reviewed local files.

- [English](https://atasardacagan.github.io/atashalci-labs/)
- [Turkish](https://atasardacagan.github.io/atashalci-labs/tr/)

Subsequent documentation-only commits do not change this tested site implementation. There is no pending implementation or publication step in this audit. Founder-domain recovery and future evidence of genuine completed work remain external/content dependencies, not claims added by this revision.
