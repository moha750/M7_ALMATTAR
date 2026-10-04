-- 0004 · المهارات: العمل الواحد قد يظهر في أكثر من مهارة.
-- category يبقى «المهارة الأساسية»، و skills كل المهارات التي يُعرض فيها العمل.

alter table public.projects
  add column if not exists skills public.discipline[] not null default '{}';

create index if not exists projects_skills_idx on public.projects using gin (skills);

-- التوزيع المعتمد
update public.projects set skills = case slug
  when 'خلف-الأبواب'        then array['editing','motion']::public.discipline[]
  when 'ركضة-وطن'           then array['code']::public.discipline[]
  when 'منصة-أديب'          then array['code','graphic','motion']::public.discipline[]
  when 'مساحة-أثر'          then array['code','graphic']::public.discipline[]
  when 'مخلدات'             then array['voice']::public.discipline[]
  when 'ديبو'               then array['graphic','code']::public.discipline[]
  when 'فيديو-اليوم-الوطني' then array['editing','motion']::public.discipline[]
  when 'أديب-ألمى'          then array['editing']::public.discipline[]
  when 'منعطف'              then array['voice','editing']::public.discipline[]
  when 'مرمى'               then array['code']::public.discipline[]
  when 'loglink'            then array['code','graphic']::public.discipline[]
  when 'onehub'             then array['code']::public.discipline[]
  when 'تطبيق-الأذان'       then array['code']::public.discipline[]
  when 'عام-بألف-ذكرى'      then array['graphic']::public.discipline[]
  when 'كوكب-زمردة'         then array['graphic']::public.discipline[]
  when 'متنفس'              then array['graphic']::public.discipline[]
  else array[category]
end
where cardinality(skills) = 0;

-- المهارة الأساسية دائمًا ضمن المهارات
update public.projects
  set skills = array_prepend(category, skills)
  where not (category = any(skills));
