#!/bin/bash
# Blind panel: each persona sees anonymous images one at a time, in its own shuffled order.
cd "$(dirname "$0")"
declare -A P
P[fe]="a front-end developer browsing npm for a JavaScript library"
P[ds]="a data scientist who uses Python notebooks every day"
P[bio]="a bioinformatician who works with biology and chemistry software daily"
P[des]="a brand designer who judges logos for a living"
P[conf]="a conference attendee who glimpses this on a slide for two seconds"
P[mgr]="a non-technical manager scrolling a social media feed"
i=0
for k in fe ds bio des conf mgr; do
  i=$((i+1))
  ORDER=$(printf "%s\n" h k m q t w z | shuf --random-source=<(yes $i) | sed "s|$|.png|;s|^|$PWD/|" | tr '\n' ' ')
  claude -p --allowedTools Read --output-format text "You are $k: ${P[$k]}. Stay in that role and answer from first impressions only. You will look at some small images, one at a time, in exactly this order: $ORDER
Each image shows ONE symbol three times: large in color, smaller in black, and a tiny version enlarged so its pixels show.
For each image: use the Read tool to open it, then immediately write your answer before opening the next one. Do not go back and change answers.
Questions for each image:
1. What is this a picture of? Name the first thing you see, in a few words, then a second thing if one comes to mind.
2. Do you see any letters in it? Which?
Answer only as lines of the form:  <file letter> | first thing | second thing | letters
(file letter = the file name without .png). No other text." > out/$k.txt 2> out/$k.err &
done
wait
