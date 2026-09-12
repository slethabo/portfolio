/* =============================================================================
   projectsData.js — the ONLY file you need to edit to update the portfolio.

   - siteConfig: your name, links, resume content.
   - projects:   one object per quest card. Change demoUrl / posterUrl to point
                 at files you drop into ./assets/demos/.

   demoType: "video" -> demoUrl should be .mp4 or .webm (poster optional)
             "gif"   -> demoUrl should be .gif (or any image)
   Missing media is handled gracefully: the viewer shows a "demo coming soon"
   placeholder instead of a broken player.
   ========================================================================== */

const siteConfig = {
  name: "Lethabo Sangweni",
  handle: "slethabo",
  title: "Cloud & AI Security Engineer",
  // Cycled by the typing effect in the hero.
  roles: [
    "Cloud Security Engineer",
    "AI Security Researcher",
    "Penetration Tester",
    "Detection & Response Builder",
  ],
  tagline:
    "I build cloud defences that fight back: automated remediation on AWS, purple-team labs in Terraform, and LLM triage with real guardrails.",
  location: "Your City, Country", // TODO
  email: "you@example.com", // TODO
  linkedin: "https://www.linkedin.com/in/your-handle", // TODO
  github: "https://github.com/slethabo",
  resumePdf: "./assets/Lethabo-Sangweni-Resume.pdf", // drop your PDF at this path
  // Used for canonical/OG URLs in README instructions. Update after first deploy.
  siteUrl: "https://slethabo.github.io/portfolio/",

  // HUD tiles in the hero. Keep these true; update as the numbers change.
  hudStats: [
    { label: "MTTR", value: "< 4.5s", hint: "GuardDuty finding to key deactivated" },
    { label: "Tests", value: "30", hint: "moto-backed pytest, all green" },
    { label: "IAM actions", value: "2", hint: "Least-privilege remediation role" },
    { label: "Quests", value: "3", hint: "One live, two in progress" },
  ],

  summary:
    "Penetration testing intern moving into cloud and AI security engineering. I like closing the loop between detection and response: I write the attack, capture the signal, and ship the automation that ends the incident without a human on call. Comfortable across AWS (IAM, Lambda, EventBridge, GuardDuty), Terraform, Python, and LLM integration with an attacker's eye for what can go wrong.",

  skills: {
    "Cloud & Infrastructure": ["AWS IAM", "Lambda", "EventBridge", "GuardDuty", "CloudTrail", "SQS", "Terraform"],
    "Offensive Security": ["Web app pentesting", "Cloud attack paths", "Stratus Red Team", "Burp Suite", "MITRE ATT&CK mapping"],
    "AI Security": ["Claude API", "Structured (JSON) outputs", "Prompt injection testing", "LLM-in-the-loop triage design"],
    "Engineering": ["Python 3.12", "boto3", "pytest + moto", "GitHub Actions", "Git", "Linux"],
  },

  experience: [
    {
      role: "Penetration Testing Intern",
      org: "Company Name", // TODO
      period: "2026 – Present",
      bullets: [
        "Perform web application and cloud configuration assessments; write findings with reproduction steps and remediation guidance.",
        "Built an automated IAM access key remediation pipeline on AWS, cutting response time from manual triage to seconds.",
        "Map findings to MITRE ATT&CK and communicate risk to engineering teams.",
      ],
    },
  ],

  education: [
    {
      title: "Your Degree / Programme", // TODO
      org: "Institution",
      period: "20XX – 20XX",
    },
  ],

  certifications: [
    // e.g. "AWS Certified Cloud Practitioner", "CompTIA Security+", "eJPT"
    "Add certifications here", // TODO
  ],
};

const projects = [
  {
    id: "aws-remediation",
    quest: 1,
    title: "AWS Immune System",
    subtitle: "Automated IAM Key Remediation Pipeline",
    status: "live", // "live" | "wip"
    difficulty: 3, // 1–5 stars
    demoType: "video", // "video" or "gif"
    demoUrl: "./assets/demos/aws-remediation-demo.mp4",
    posterUrl: "./assets/demos/aws-remediation-thumb.png",
    githubUrl: "https://github.com/slethabo/AWS-automated-key-remediation",
    threatModelUrl:
      "https://github.com/slethabo/AWS-automated-key-remediation/blob/main/infra/README.md#guardrails-built-in",
    metrics: "MTTR: < 4.5s", // TODO: replace with the measured value from your lab run
    tags: ["AWS", "Lambda", "GuardDuty", "EventBridge", "Python", "Terraform"],
    description:
      "When GuardDuty or AWS Health flags a compromised IAM access key, an EventBridge rule reshapes the finding and invokes a Lambda that resolves the key owner in a single API call and deactivates it. No human in the loop, no blast radius beyond the one key.",
    architecture: [
      "GuardDuty finding (IAMUser access key, severity ≥ 7) or AWS Health CREDENTIALS_EXPOSED event",
      "EventBridge rule filters by finding type, severity, and break-glass exemptions; an input transformer reshapes it to {access_key_id}",
      "Lambda (Python 3.12, arm64) resolves the owner with iam:GetAccessKeyLastUsed and calls iam:UpdateAccessKey → Inactive",
      "Failures land in an SQS dead-letter queue; every action is logged to CloudWatch with 90-day retention",
    ],
    threatModel: [
      "Leaked AKIA key used from a malicious IP → GuardDuty fires → key is Inactive within seconds, CloudTrail history preserved",
      "Remediation as a weapon: only two EventBridge rules can invoke the function; reserved concurrency of 2 caps mass-deactivation",
      "Least privilege: role limited to GetAccessKeyLastUsed + UpdateAccessKey on user/*; cannot touch roles or the root account",
      "Temporary ASIA credentials are out of scope for UpdateAccessKey and are rejected at input validation",
    ],
    stats: [
      { label: "MTTR", value: "< 4.5s" },
      { label: "Tests", value: "30 passing" },
      { label: "IAM actions", value: "2" },
      { label: "Concurrency cap", value: "2" },
    ],
    mitre: ["T1078.004 Valid Accounts: Cloud", "T1552.005 Cloud Instance Metadata API"],
    // Short bullets for the resume view.
    highlights: [
      "Replaced O(users) IAM enumeration with a single GetAccessKeyLastUsed call; handler runs in two API calls.",
      "Terraform module: least-privilege role, EventBridge rules with severity floor, type allowlist and user exemptions, SQS DLQ.",
      "30 moto-backed tests and a GitHub Actions pipeline (ruff, pytest on 3.12/3.13, terraform validate, Lambda artifact).",
    ],
  },
  {
    id: "cloud-guardian",
    quest: 2,
    title: "Cloud Guardian",
    subtitle: "Terraform Purple-Team Attack Lab",
    status: "wip",
    difficulty: 4,
    demoType: "gif",
    demoUrl: "./assets/demos/cloud-guardian-demo.gif",
    posterUrl: "",
    githubUrl: "https://github.com/slethabo/cloud-guardian", // TODO: create repo
    threatModelUrl: "https://github.com/slethabo/cloud-guardian#threat-model", // TODO
    metrics: "Detections: GuardDuty × Stratus",
    tags: ["Terraform", "Stratus Red Team", "GuardDuty", "Purple Team", "CloudTrail"],
    description:
      "A disposable AWS lab that stands up a victim IAM user, runs real credential-access and exfiltration techniques with Stratus Red Team, and measures how fast the detection and remediation stack responds. Attack, signal, response, all as code.",
    architecture: [
      "Terraform provisions an isolated lab account: victim user + key, GuardDuty, CloudTrail, and the remediation pipeline from Quest 1",
      "Stratus Red Team executes aws.credential-access.* and aws.exfiltration.* techniques from an unusual network location",
      "GuardDuty findings flow through EventBridge into remediation; CloudTrail captures the full attacker timeline",
      "A runbook script collects finding timestamps and Lambda logs to compute mean time to remediate per technique",
    ],
    threatModel: [
      "Attacker steals long-term keys via leaked repo or phished developer → detected as MaliciousIPCaller / AnomalousBehavior",
      "Attacker steals EC2 instance role credentials (ASIA) → InstanceCredentialExfiltration finding; remediation revokes sessions via aws:TokenIssueTime policy",
      "Lab isolation: dedicated account, budget alarm, terraform destroy at the end of every run",
    ],
    stats: [
      { label: "Techniques", value: "6 planned" },
      { label: "Teardown", value: "1 command" },
      { label: "Status", value: "In progress" },
    ],
    mitre: ["T1552.005 Cloud Instance Metadata API", "T1078.004 Valid Accounts: Cloud", "T1530 Data from Cloud Storage"],
    highlights: [
      "Designing a repeatable purple-team lab in Terraform to validate detections against real ATT&CK techniques.",
      "Measures detection-to-remediation latency per technique and feeds results back into rule tuning.",
    ],
  },
  {
    id: "ai-triage",
    quest: 3,
    title: "AI Triage & Guardrails",
    subtitle: "Claude-Powered Finding Triage with Injection Defences",
    status: "wip",
    difficulty: 5,
    demoType: "video",
    demoUrl: "./assets/demos/ai-triage-demo.mp4",
    posterUrl: "./assets/demos/ai-triage-thumb.png",
    githubUrl: "https://github.com/slethabo/ai-triage-guardrails", // TODO: create repo
    threatModelUrl: "https://github.com/slethabo/ai-triage-guardrails#threat-model", // TODO
    metrics: "Injection payloads blocked: 100%",
    tags: ["Claude API", "Python", "Prompt Injection", "JSON Schema", "CloudTrail"],
    description:
      "An LLM sits between detection and response, but never holds the keys. Claude receives the GuardDuty finding plus the key's recent CloudTrail activity and returns a schema-constrained verdict: remediate, escalate, or ignore. The Lambda enforces policy; the model only advises.",
    architecture: [
      "Enrichment step pulls the last 24h of CloudTrail events for the flagged key",
      "Claude is prompted with finding + activity and must answer in a strict JSON schema (verdict, confidence, reasoning)",
      "Deterministic policy layer: high-confidence remediate → auto; anything else → human approval via SNS/Slack",
      "Log scanner reuses the AKIA regex to catch keys leaking through agent transcripts and CI logs, feeding the same pipeline",
    ],
    threatModel: [
      "Prompt injection via attacker-controlled CloudTrail fields (user agents, resource names) → treated as untrusted input, tested with a payload corpus",
      "Model over-reach: no tools, no credentials, output validated against schema before use; malformed output = escalate",
      "Denial of remediation: attacker crafts activity to make the model say 'ignore' → severity floor still forces human review",
    ],
    stats: [
      { label: "Injection corpus", value: "40+ payloads" },
      { label: "Model tools", value: "0" },
      { label: "Status", value: "In progress" },
    ],
    mitre: ["AML.T0051 LLM Prompt Injection", "T1078.004 Valid Accounts: Cloud"],
    highlights: [
      "Designing an LLM-in-the-loop SOC step where the model advises and deterministic code decides.",
      "Building a prompt-injection test corpus against attacker-influenced CloudTrail data.",
    ],
  },
];
