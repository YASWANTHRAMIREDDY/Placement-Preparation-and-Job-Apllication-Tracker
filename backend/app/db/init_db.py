import logging
from sqlalchemy.orm import Session
from app.db.session import Base, engine
from app.core.security import get_password_hash
from app.models.user import User
from app.models.application import JobApplication
from app.models.preparation import (
    DSAProblem,
    SQLProblem,
    AptitudeTopic,
    CoreSubjectTopic,
    UserDSAProgress,
    UserSQLProgress,
    UserAptitudeProgress,
    UserCoreProgress,
)
from datetime import datetime, timezone, timedelta

logger = logging.getLogger(__name__)


def init_db(db: Session) -> None:
    # 1. Create tables
    Base.metadata.create_all(bind=engine)

    # 2. Seed DSA Problems if empty
    if db.query(DSAProblem).count() == 0:
        logger.info("Seeding DSA Question Bank...")
        dsa_data = [
            # Arrays & Hashing
            {"title": "Contains Duplicate", "topic": "Arrays & Hashing", "difficulty": "Easy", "pattern": "Hash Set", "leetcode_url": "https://leetcode.com/problems/contains-duplicate/"},
            {"title": "Valid Anagram", "topic": "Arrays & Hashing", "difficulty": "Easy", "pattern": "Frequency Map", "leetcode_url": "https://leetcode.com/problems/valid-anagram/"},
            {"title": "Two Sum", "topic": "Arrays & Hashing", "difficulty": "Easy", "pattern": "Hash Map Complement", "leetcode_url": "https://leetcode.com/problems/two-sum/"},
            {"title": "Group Anagrams", "topic": "Arrays & Hashing", "difficulty": "Medium", "pattern": "Categorize by Sorted Key", "leetcode_url": "https://leetcode.com/problems/group-anagrams/"},
            {"title": "Top K Frequent Elements", "topic": "Arrays & Hashing", "difficulty": "Medium", "pattern": "Bucket Sort / Min-Heap", "leetcode_url": "https://leetcode.com/problems/top-k-frequent-elements/"},
            {"title": "Product of Array Except Self", "topic": "Arrays & Hashing", "difficulty": "Medium", "pattern": "Prefix & Suffix Products", "leetcode_url": "https://leetcode.com/problems/product-of-array-except-self/"},
            {"title": "Longest Consecutive Sequence", "topic": "Arrays & Hashing", "difficulty": "Medium", "pattern": "Hash Set Bounds", "leetcode_url": "https://leetcode.com/problems/longest-consecutive-sequence/"},
            
            # Two Pointers
            {"title": "Valid Palindrome", "topic": "Two Pointers", "difficulty": "Easy", "pattern": "Two Pointers Converging", "leetcode_url": "https://leetcode.com/problems/valid-palindrome/"},
            {"title": "Two Sum II - Input Array Is Sorted", "topic": "Two Pointers", "difficulty": "Medium", "pattern": "Sorted Two Pointers", "leetcode_url": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/"},
            {"title": "3Sum", "topic": "Two Pointers", "difficulty": "Medium", "pattern": "Sort + Two Pointers", "leetcode_url": "https://leetcode.com/problems/3sum/"},
            {"title": "Container With Most Water", "topic": "Two Pointers", "difficulty": "Medium", "pattern": "Greedy Two Pointers", "leetcode_url": "https://leetcode.com/problems/container-with-most-water/"},
            {"title": "Trapping Rain Water", "topic": "Two Pointers", "difficulty": "Hard", "pattern": "Max Left/Right Pointers", "leetcode_url": "https://leetcode.com/problems/trapping-rain-water/"},

            # Sliding Window
            {"title": "Best Time to Buy and Sell Stock", "topic": "Sliding Window", "difficulty": "Easy", "pattern": "Track Min Price", "leetcode_url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"},
            {"title": "Longest Substring Without Repeating Characters", "topic": "Sliding Window", "difficulty": "Medium", "pattern": "Dynamic Window with Set", "leetcode_url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/"},
            {"title": "Longest Repeating Character Replacement", "topic": "Sliding Window", "difficulty": "Medium", "pattern": "Window Max Frequency", "leetcode_url": "https://leetcode.com/problems/longest-repeating-character-replacement/"},
            {"title": "Minimum Window Substring", "topic": "Sliding Window", "difficulty": "Hard", "pattern": "Count Map Window Match", "leetcode_url": "https://leetcode.com/problems/minimum-window-substring/"},

            # Stack
            {"title": "Valid Parentheses", "topic": "Stack", "difficulty": "Easy", "pattern": "LIFO Matching", "leetcode_url": "https://leetcode.com/problems/valid-parentheses/"},
            {"title": "Min Stack", "topic": "Stack", "difficulty": "Medium", "pattern": "Auxiliary Min Stack", "leetcode_url": "https://leetcode.com/problems/min-stack/"},
            {"title": "Daily Temperatures", "topic": "Stack", "difficulty": "Medium", "pattern": "Monotonic Stack", "leetcode_url": "https://leetcode.com/problems/daily-temperatures/"},

            # Linked List
            {"title": "Reverse Linked List", "topic": "Linked List", "difficulty": "Easy", "pattern": "Iterative Prev-Curr-Next", "leetcode_url": "https://leetcode.com/problems/reverse-linked-list/"},
            {"title": "Merge Two Sorted Lists", "topic": "Linked List", "difficulty": "Easy", "pattern": "Dummy Head Pointer", "leetcode_url": "https://leetcode.com/problems/merge-two-sorted-lists/"},
            {"title": "Linked List Cycle", "topic": "Linked List", "difficulty": "Easy", "pattern": "Floyd Tortoise & Hare", "leetcode_url": "https://leetcode.com/problems/linked-list-cycle/"},
            {"title": "Remove Nth Node From End of List", "topic": "Linked List", "difficulty": "Medium", "pattern": "Fast & Slow Offset", "leetcode_url": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"},

            # Trees
            {"title": "Invert Binary Tree", "topic": "Trees", "difficulty": "Easy", "pattern": "DFS Recursion", "leetcode_url": "https://leetcode.com/problems/invert-binary-tree/"},
            {"title": "Maximum Depth of Binary Tree", "topic": "Trees", "difficulty": "Easy", "pattern": "DFS Depth", "leetcode_url": "https://leetcode.com/problems/maximum-depth-of-binary-tree/"},
            {"title": "Diameter of Binary Tree", "topic": "Trees", "difficulty": "Easy", "pattern": "Postorder Traversal", "leetcode_url": "https://leetcode.com/problems/diameter-of-binary-tree/"},
            {"title": "Balanced Binary Tree", "topic": "Trees", "difficulty": "Easy", "pattern": "Bottom-Up Height Check", "leetcode_url": "https://leetcode.com/problems/balanced-binary-tree/"},
            {"title": "Same Tree", "topic": "Trees", "difficulty": "Easy", "pattern": "Recursive Tree Match", "leetcode_url": "https://leetcode.com/problems/same-tree/"},
            {"title": "Subtree of Another Tree", "topic": "Trees", "difficulty": "Easy", "pattern": "Double DFS", "leetcode_url": "https://leetcode.com/problems/subtree-of-another-tree/"},
            {"title": "Lowest Common Ancestor of a BST", "topic": "Trees", "difficulty": "Medium", "pattern": "BST Property Split", "leetcode_url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"},
            {"title": "Binary Tree Level Order Traversal", "topic": "Trees", "difficulty": "Medium", "pattern": "BFS Queue", "leetcode_url": "https://leetcode.com/problems/binary-tree-level-order-traversal/"},
            {"title": "Validate Binary Search Tree", "topic": "Trees", "difficulty": "Medium", "pattern": "Min/Max Range Propagation", "leetcode_url": "https://leetcode.com/problems/validate-binary-search-tree/"},
            {"title": "Kth Smallest Element in a BST", "topic": "Trees", "difficulty": "Medium", "pattern": "Inorder Traversal", "leetcode_url": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/"},

            # Dynamic Programming
            {"title": "Climbing Stairs", "topic": "Dynamic Programming", "difficulty": "Easy", "pattern": "Fibonacci DP", "leetcode_url": "https://leetcode.com/problems/climbing-stairs/"},
            {"title": "House Robber", "topic": "Dynamic Programming", "difficulty": "Medium", "pattern": "State Machine DP", "leetcode_url": "https://leetcode.com/problems/house-robber/"},
            {"title": "House Robber II", "topic": "Dynamic Programming", "difficulty": "Medium", "pattern": "Circular DP", "leetcode_url": "https://leetcode.com/problems/house-robber-ii/"},
            {"title": "Longest Palindromic Substring", "topic": "Dynamic Programming", "difficulty": "Medium", "pattern": "Expand Around Center", "leetcode_url": "https://leetcode.com/problems/longest-palindromic-substring/"},
            {"title": "Coin Change", "topic": "Dynamic Programming", "difficulty": "Medium", "pattern": "Unbounded Knapsack", "leetcode_url": "https://leetcode.com/problems/coin-change/"},
            {"title": "Longest Increasing Subsequence", "topic": "Dynamic Programming", "difficulty": "Medium", "pattern": "Patience Sorting / DP", "leetcode_url": "https://leetcode.com/problems/longest-increasing-subsequence/"},

            # Graphs
            {"title": "Number of Islands", "topic": "Graphs", "difficulty": "Medium", "pattern": "BFS/DFS Grid Flood Fill", "leetcode_url": "https://leetcode.com/problems/number-of-islands/"},
            {"title": "Clone Graph", "topic": "Graphs", "difficulty": "Medium", "pattern": "DFS Hash Map", "leetcode_url": "https://leetcode.com/problems/clone-graph/"},
            {"title": "Pacific Atlantic Water Flow", "topic": "Graphs", "difficulty": "Medium", "pattern": "Reverse DFS from Ocean", "leetcode_url": "https://leetcode.com/problems/pacific-atlantic-water-flow/"},
            {"title": "Course Schedule", "topic": "Graphs", "difficulty": "Medium", "pattern": "Topological Sort / Kahn's Algo", "leetcode_url": "https://leetcode.com/problems/course-schedule/"},
        ]
        for item in dsa_data:
            db.add(DSAProblem(**item))
        db.commit()

    # 3. Seed SQL Problems if empty
    if db.query(SQLProblem).count() == 0:
        logger.info("Seeding SQL Question Bank...")
        sql_data = [
            {"title": "Second Highest Salary", "topic": "Aggregations & Subqueries", "difficulty": "Medium", "scenario": "Write a SQL query to get the second highest salary from the Employee table. If there is no second highest salary, return null.", "expected_query": "SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);", "platform_url": "https://leetcode.com/problems/second-highest-salary/"},
            {"title": "Nth Highest Salary", "topic": "User-Defined Functions / Dense Rank", "difficulty": "Medium", "scenario": "Find the nth highest salary from the Employee table dynamically.", "expected_query": "CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT BEGIN SET N = N - 1; RETURN (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET N); END", "platform_url": "https://leetcode.com/problems/nth-highest-salary/"},
            {"title": "Rank Scores", "topic": "Window Functions", "difficulty": "Medium", "scenario": "Rank the scores of students. If there is a tie, both should have the same rank without skipping consecutive ranks.", "expected_query": "SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS 'rank' FROM Scores;", "platform_url": "https://leetcode.com/problems/rank-scores/"},
            {"title": "Consecutive Numbers", "topic": "Self Joins / Window Functions", "difficulty": "Medium", "scenario": "Find all numbers that appear at least three times consecutively in a table.", "expected_query": "SELECT DISTINCT num AS ConsecutiveNums FROM (SELECT num, LAG(num, 1) OVER () AS prev, LEAD(num, 1) OVER () AS next FROM Logs) t WHERE num = prev AND num = next;", "platform_url": "https://leetcode.com/problems/consecutive-numbers/"},
            {"title": "Employees Earning More Than Their Managers", "topic": "Self Joins", "difficulty": "Easy", "scenario": "Find employees who earn strictly more than their direct managers.", "expected_query": "SELECT e1.name AS Employee FROM Employee e1 JOIN Employee e2 ON e1.managerId = e2.id WHERE e1.salary > e2.salary;", "platform_url": "https://leetcode.com/problems/employees-earning-more-than-their-managers/"},
            {"title": "Duplicate Emails", "topic": "Group By & Having", "difficulty": "Easy", "scenario": "Report all the duplicate emails in the Person table.", "expected_query": "SELECT email FROM Person GROUP BY email HAVING COUNT(email) > 1;", "platform_url": "https://leetcode.com/problems/duplicate-emails/"},
            {"title": "Customers Who Never Order", "topic": "Left Outer Join / Not In", "difficulty": "Easy", "scenario": "Find all customers who never placed any orders.", "expected_query": "SELECT name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.customerId IS NULL;", "platform_url": "https://leetcode.com/problems/customers-who-never-order/"},
            {"title": "Department Highest Salary", "topic": "Joins & Subqueries / Window Functions", "difficulty": "Medium", "scenario": "Find employees who have the highest salary in each department.", "expected_query": "SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);", "platform_url": "https://leetcode.com/problems/department-highest-salary/"},
            {"title": "Delete Duplicate Emails", "topic": "DELETE with Join", "difficulty": "Easy", "scenario": "Delete all the duplicate emails, keeping only one unique email with the smallest id.", "expected_query": "DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id;", "platform_url": "https://leetcode.com/problems/delete-duplicate-emails/"},
            {"title": "Rising Temperature", "topic": "Date Functions & Joins", "difficulty": "Easy", "scenario": "Find all dates' Id with higher temperatures compared to its previous dates (yesterday).", "expected_query": "SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;", "platform_url": "https://leetcode.com/problems/rising-temperature/"},
        ]
        for item in sql_data:
            db.add(SQLProblem(**item))
        db.commit()

    # 4. Seed Aptitude Topics if empty
    if db.query(AptitudeTopic).count() == 0:
        logger.info("Seeding Aptitude Curriculum...")
        apt_data = [
            # Quantitative
            {"category": "Quantitative Ability", "topic_name": "Percentages, Profit & Loss", "formula_summary": "Gain% = (Gain*100)/CP. SP = ((100+Gain%)/100)*CP. Discount = MP - SP.", "total_suggested_questions": 35},
            {"category": "Quantitative Ability", "topic_name": "Time, Speed & Distance / Trains", "formula_summary": "Speed = Distance / Time. Relative Speed (Same dir) = u - v; (Opp dir) = u + v.", "total_suggested_questions": 40},
            {"category": "Quantitative Ability", "topic_name": "Time & Work / Pipes & Cisterns", "formula_summary": "If A completes in x days, 1 day work = 1/x. Efficiency = Total Work / Days.", "total_suggested_questions": 35},
            {"category": "Quantitative Ability", "topic_name": "Permutations & Combinations / Probability", "formula_summary": "nPr = n! / (n-r)!; nCr = n! / (r! * (n-r)!). P(E) = n(E) / n(S).", "total_suggested_questions": 30},
            {"category": "Quantitative Ability", "topic_name": "Ratio, Proportions & Mixtures/Alligation", "formula_summary": "Rule of Alligation: (Cheaper Qty) / (Dearer Qty) = (Dearer Price - Mean) / (Mean - Cheaper).", "total_suggested_questions": 25},
            
            # Logical Reasoning
            {"category": "Logical Reasoning", "topic_name": "Blood Relations & Family Tree", "formula_summary": "Use standard symbols: + for male, - for female, = for spouse, single line for siblings.", "total_suggested_questions": 30},
            {"category": "Logical Reasoning", "topic_name": "Direction Sense & Distance", "formula_summary": "Use standard cardinal directions (N, S, E, W). Pythagoras theorem for displacement: d = sqrt(x^2 + y^2).", "total_suggested_questions": 25},
            {"category": "Logical Reasoning", "topic_name": "Seating Arrangement (Linear & Circular)", "formula_summary": "Facing Center: Clockwise is Right, Counter-clockwise is Left. Start with fixed deterministic clues.", "total_suggested_questions": 40},
            {"category": "Logical Reasoning", "topic_name": "Syllogisms & Venn Diagrams", "formula_summary": "A: All (100%), E: No (100%), I: Some (50%), O: Some not (50%). Check validity of conclusions.", "total_suggested_questions": 35},

            # Verbal Ability
            {"category": "Verbal Ability", "topic_name": "Reading Comprehension", "formula_summary": "Skim for central thesis, note tone (analytical, critical, informative), locate keywords in passage.", "total_suggested_questions": 20},
            {"category": "Verbal Ability", "topic_name": "Sentence Correction & Subject-Verb Agreement", "formula_summary": "Singular subject takes singular verb. Modifiers must be placed immediately adjacent to the noun they modify.", "total_suggested_questions": 30},
            {"category": "Verbal Ability", "topic_name": "Para Jumbles & Sentence Rearrangement", "formula_summary": "Identify opening independent statement. Look for mandatory pairs (Pronouns, Chronology, Conjunctions).", "total_suggested_questions": 25},
        ]
        for item in apt_data:
            db.add(AptitudeTopic(**item))
        db.commit()

    # 5. Seed Core CS Topics if empty
    if db.query(CoreSubjectTopic).count() == 0:
        logger.info("Seeding Core CS Topics...")
        core_data = [
            # OS
            {
                "subject": "Operating Systems",
                "topic_name": "Processes, Threads & Multithreading",
                "summary_notes": "Process is a program in execution (has separate address space). Thread is a lightweight execution unit sharing code/data/heap with parent process but with its own stack and registers.",
                "frequent_questions": "Difference between process and thread? What is context switching overhead? Why are threads preferred for I/O bound tasks?"
            },
            {
                "subject": "Operating Systems",
                "topic_name": "CPU Scheduling Algorithms",
                "summary_notes": "FCFS, SJF, SRTF (optimal avg turnaround time), Round Robin (time quantum tradeoff), Priority Scheduling (starvation avoided by Aging).",
                "frequent_questions": "What happens if Round Robin time quantum is too high or too low? What is Convoy Effect in FCFS?"
            },
            {
                "subject": "Operating Systems",
                "topic_name": "Synchronization, Mutex, Semaphores & Deadlocks",
                "summary_notes": "Deadlock 4 Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Mutex is locking mechanism (ownership), Semaphore is signaling (counting / binary).",
                "frequent_questions": "Explain Banker's Algorithm for deadlock avoidance. How to solve Dining Philosophers problem?"
            },
            {
                "subject": "Operating Systems",
                "topic_name": "Memory Management & Virtual Memory",
                "summary_notes": "Paging (fixed size pages/frames), Segmentation (logical variable size), Page Fault, Thrashing (CPU busy swapping rather than executing). LRU page replacement.",
                "frequent_questions": "What is TLB (Translation Lookaside Buffer)? Explain Belady's Anomaly in FIFO page replacement."
            },

            # DBMS
            {
                "subject": "DBMS",
                "topic_name": "ACID Properties & Transactions",
                "summary_notes": "Atomicity (all or nothing, WAL), Consistency (valid state transitions), Isolation (concurrency levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable), Durability (persisted on disk).",
                "frequent_questions": "Explain Dirty Read, Non-repeatable Read, and Phantom Read. What is 2-Phase Locking (2PL)?"
            },
            {
                "subject": "DBMS",
                "topic_name": "Database Normalization (1NF to BCNF)",
                "summary_notes": "1NF: Atomic values; 2NF: 1NF + No partial functional dependency; 3NF: 2NF + No transitive dependency; BCNF: Every determinant is a candidate key.",
                "frequent_questions": "Why do we denormalize in read-heavy production warehouses? When to choose 3NF vs BCNF?"
            },
            {
                "subject": "DBMS",
                "topic_name": "Indexing & B+ Trees",
                "summary_notes": "Clustered Index: defines physical storage order of table (only 1 per table). Non-clustered index: separate pointer structure. B+ tree stores all data in leaf nodes linked as a doubly-linked list.",
                "frequent_questions": "Why are B+ Trees used in databases instead of Binary Search Trees or Hash Tables? What is a composite index and leftmost prefix rule?"
            },

            # Computer Networks
            {
                "subject": "Computer Networks",
                "topic_name": "OSI 7-Layer vs TCP/IP Model",
                "summary_notes": "Application, Presentation, Session, Transport (Segments/Ports), Network (Packets/IP), Data Link (Frames/MAC), Physical (Bits).",
                "frequent_questions": "What happens when you type https://www.google.com into your browser? (DNS -> TCP 3-way -> TLS Handshake -> HTTP GET -> Render)"
            },
            {
                "subject": "Computer Networks",
                "topic_name": "TCP vs UDP & 3-Way Handshake",
                "summary_notes": "TCP: Connection-oriented, reliable, ordered, flow control (Sliding Window), congestion control (Slow Start, AIMD). UDP: Connectionless, fast, header 8 bytes vs 20-60 bytes.",
                "frequent_questions": "Explain SYN, SYN-ACK, ACK. What is TIME_WAIT state in TCP teardown and why does it exist (2*MSL)?"
            },
            {
                "subject": "Computer Networks",
                "topic_name": "DNS, HTTP vs HTTPS & SSL/TLS",
                "summary_notes": "DNS translates domain names to IP addresses (hierarchical recursive/iterative resolver). HTTPS encrypts traffic via TLS using asymmetric encryption (RSA/ECC) for key exchange and symmetric (AES) for data transmission.",
                "frequent_questions": "Difference between HTTP/1.1, HTTP/2 (Multiplexing), and HTTP/3 (QUIC over UDP)?"
            },

            # OOP
            {
                "subject": "OOP & System Design",
                "topic_name": "Core 4 OOP Pillars & Real World Use",
                "summary_notes": "Encapsulation (data hiding with access specifiers), Abstraction (hiding implementation via interfaces/abstract classes), Inheritance (code reuse, is-a relationship), Polymorphism (Compile-time overloading, Runtime overriding).",
                "frequent_questions": "Composition vs Inheritance: why favor composition? What is diamond problem in multiple inheritance and how does C++/Java handle it?"
            },
            {
                "subject": "OOP & System Design",
                "topic_name": "SOLID Principles",
                "summary_notes": "S: Single Responsibility, O: Open/Closed (open for extension, closed for modification), L: Liskov Substitution, I: Interface Segregation, D: Dependency Inversion.",
                "frequent_questions": "Give a code example violating Liskov Substitution Principle (Square vs Rectangle). How does Dependency Injection implement DIP?"
            },
            {
                "subject": "OOP & System Design",
                "topic_name": "Essential Design Patterns",
                "summary_notes": "Creational: Singleton (thread-safe double checked locking), Factory Method. Structural: Adapter, Decorator. Behavioral: Observer (Pub/Sub), Strategy.",
                "frequent_questions": "Explain Singleton implementation with thread safety. What is the difference between Strategy Pattern and State Pattern?"
            },
        ]
        for item in core_data:
            db.add(CoreSubjectTopic(**item))
        db.commit()

    # 6. Create demo student user if none exists
    demo_user = db.query(User).filter(User.email == "demo@student.com").first()
    if not demo_user:
        logger.info("Creating demo student user (demo@student.com / password123)...")
        demo_user = User(
            email="demo@student.com",
            hashed_password=get_password_hash("password123"),
            full_name="Alex Chen",
            college="National Institute of Technology",
            branch="Computer Science & Engineering",
            graduation_year=2025,
            cgpa=8.85,
            target_role="Software Development Engineer (SDE)",
            target_ctc="24 LPA",
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        # Seed sample job applications for the demo user
        now = datetime.now(timezone.utc)
        sample_apps = [
            JobApplication(
                user_id=demo_user.id,
                company_name="Google",
                role_title="Software Engineer - Early Career",
                job_type="Full Time",
                location="Bangalore / Hyderabad",
                ctc_or_stipend="32 LPA",
                status="Tech Round 2",
                application_date=now - timedelta(days=18),
                deadline=now + timedelta(days=10),
                next_interview_date=now + timedelta(days=3),
                job_url="https://careers.google.com/jobs/results/",
                referral_name="Senior Engineer via LinkedIn",
                notes="Completed OA with 100% test cases. Round 1 focused on Binary Trees and LCA. Round 2 is Graph Algorithms & System Design fundamentals.",
            ),
            JobApplication(
                user_id=demo_user.id,
                company_name="Microsoft",
                role_title="Software Development Engineer (SDE 1)",
                job_type="Full Time",
                location="Hyderabad / Remote",
                ctc_or_stipend="24 LPA",
                status="Offered",
                application_date=now - timedelta(days=35),
                deadline=now + timedelta(days=5),
                next_interview_date=None,
                job_url="https://careers.microsoft.com/",
                referral_name="College Alumni",
                notes="Offer letter received! Need to decide before acceptance deadline. Strong team and Azure cloud project.",
            ),
            JobApplication(
                user_id=demo_user.id,
                company_name="Amazon",
                role_title="SDE Intern (6 Months)",
                job_type="Internship",
                location="Bangalore",
                ctc_or_stipend="80,000 / month",
                status="Online Assessment",
                application_date=now - timedelta(days=5),
                deadline=now + timedelta(days=2),
                next_interview_date=now + timedelta(days=1),
                job_url="https://amazon.jobs",
                referral_name="Self Applied",
                notes="OA link received. 2 Coding questions + Amazon Leadership Principles work style simulation.",
            ),
            JobApplication(
                user_id=demo_user.id,
                company_name="Atlassian",
                role_title="Associate Software Engineer",
                job_type="Full Time",
                location="Bengaluru",
                ctc_or_stipend="28 LPA",
                status="HR Round",
                application_date=now - timedelta(days=22),
                deadline=None,
                next_interview_date=now + timedelta(days=4),
                job_url="https://www.atlassian.com/company/careers",
                referral_name="Campus Placement Cell",
                notes="Values interview (Open company no bullshit, Be the change you seek). Be prepared with STAR technique behavioral stories.",
            ),
            JobApplication(
                user_id=demo_user.id,
                company_name="Stripe",
                role_title="Software Engineer",
                job_type="Full Time",
                location="Remote",
                ctc_or_stipend="30 LPA",
                status="Applied",
                application_date=now - timedelta(days=2),
                deadline=now + timedelta(days=14),
                next_interview_date=None,
                job_url="https://stripe.com/jobs",
                referral_name="Tech Meetup Referral",
                notes="Resume submitted through employee portal.",
            ),
            JobApplication(
                user_id=demo_user.id,
                company_name="Goldman Sachs",
                role_title="Analyst (Software Engineering)",
                job_type="Full Time",
                location="Bangalore",
                ctc_or_stipend="22 LPA",
                status="Rejected",
                application_date=now - timedelta(days=40),
                deadline=None,
                next_interview_date=None,
                job_url="https://www.goldmansachs.com/careers/",
                referral_name="Campus Placement",
                notes="Rejected after Round 1 math/probability heavy questions. Need to revise combinatorics and quick probability calculations.",
            ),
        ]
        for app in sample_apps:
            db.add(app)
        db.commit()

        # Seed initial user progress for demo user
        dsa_problems = db.query(DSAProblem).limit(8).all()
        for idx, prob in enumerate(dsa_problems):
            status = "Solved" if idx < 5 else "In Progress"
            db.add(UserDSAProgress(
                user_id=demo_user.id,
                problem_id=prob.id,
                status=status,
                needs_revision=(idx % 3 == 0),
                notes="Clean O(N) solution using hash table." if idx == 0 else "Reviewed edge cases."
            ))

        sql_problems = db.query(SQLProblem).limit(5).all()
        for idx, sprob in enumerate(sql_problems):
            db.add(UserSQLProgress(
                user_id=demo_user.id,
                problem_id=sprob.id,
                status="Solved" if idx < 3 else "Todo",
                user_query=sprob.expected_query
            ))

        apt_topics = db.query(AptitudeTopic).all()
        for idx, atop in enumerate(apt_topics):
            db.add(UserAptitudeProgress(
                user_id=demo_user.id,
                topic_id=atop.id,
                completed_questions=15 if idx < 3 else 5,
                accuracy_percentage=85.0 if idx < 3 else 70.0
            ))

        core_topics = db.query(CoreSubjectTopic).all()
        for idx, ctop in enumerate(core_topics):
            db.add(UserCoreProgress(
                user_id=demo_user.id,
                topic_id=ctop.id,
                status="Mastered" if idx < 3 else ("In Progress" if idx < 6 else "Not Started"),
                confidence_rating=5 if idx < 3 else 3
            ))

        db.commit()
        logger.info("Demo user data seeded successfully!")
