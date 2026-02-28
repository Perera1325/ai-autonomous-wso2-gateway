\# High API Error Rate Alert



\## Description

Triggers when API 500 error rate exceeds 20% for more than 1 minute.



\## PromQL Query



(

&nbsp; sum(rate(http\_request\_duration\_seconds\_count{status\_code="500"}\[1m]))

&nbsp; /

&nbsp; clamp\_min(sum(rate(http\_request\_duration\_seconds\_count\[1m])), 1)

) \* 100



\## Condition

Is above 20



\## Evaluation Behavior

\- Evaluate every: 30s

\- For: 1m



\## Purpose

Detect backend instability and trigger alert before full outage.

