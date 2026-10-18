-- RLS context contract:
-- Each authenticated server request must set the transaction-local
-- app.current_profile_id to the internal SignalFoundry profile UUID.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces FORCE ROW LEVEL SECURITY;
ALTER TABLE public.customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_segments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems FORCE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals FORCE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities FORCE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records FORCE ROW LEVEL SECURITY;

CREATE POLICY profiles_owner_policy ON public.profiles
  USING (id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid)
  WITH CHECK (id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid);

CREATE POLICY workspaces_owner_policy ON public.workspaces
  USING (owner_profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid)
  WITH CHECK (owner_profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid);

CREATE POLICY customer_segments_owner_policy ON public.customer_segments
  USING (workspace_id IN (
    SELECT id FROM public.workspaces
    WHERE owner_profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid
  ))
  WITH CHECK (workspace_id IN (
    SELECT id FROM public.workspaces
    WHERE owner_profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid
  ));

CREATE POLICY problems_owner_policy ON public.problems
  USING (workspace_id IN (
    SELECT id FROM public.workspaces
    WHERE owner_profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid
  ))
  WITH CHECK (workspace_id IN (
    SELECT id FROM public.workspaces
    WHERE owner_profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid
  ));

CREATE POLICY signals_owner_policy ON public.signals
  USING (workspace_id IN (
    SELECT id FROM public.workspaces
    WHERE owner_profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid
  ))
  WITH CHECK (workspace_id IN (
    SELECT id FROM public.workspaces
    WHERE owner_profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid
  ));

CREATE POLICY opportunities_owner_policy ON public.opportunities
  USING (workspace_id IN (
    SELECT id FROM public.workspaces
    WHERE owner_profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid
  ))
  WITH CHECK (workspace_id IN (
    SELECT id FROM public.workspaces
    WHERE owner_profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid
  ));

CREATE POLICY decisions_owner_policy ON public.decisions
  USING (workspace_id IN (
    SELECT id FROM public.workspaces
    WHERE owner_profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid
  ))
  WITH CHECK (workspace_id IN (
    SELECT id FROM public.workspaces
    WHERE owner_profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid
  ));

CREATE POLICY consent_records_owner_policy ON public.consent_records
  USING (profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid)
  WITH CHECK (profile_id = NULLIF(current_setting('app.current_profile_id', true), '')::uuid);
